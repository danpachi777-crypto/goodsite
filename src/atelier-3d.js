import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Keep the photographic scene available on devices without WebGL.
const photographicScene = window.AtelierScene;
const views = new WeakMap();
let modelPromise;
const clamp = value => Math.max(0,Math.min(1,value));
const smooth = value => { const t=clamp(value); return t*t*t*(t*(t*6-15)+10); };

function loadModel() {
  if (!modelPromise) {
    const decoder = new DRACOLoader().setDecoderPath('vendor/draco/').setDecoderConfig({type:'wasm'});
    const loader = new GLTFLoader().setDRACOLoader(decoder);
    modelPromise = loader.loadAsync('models/atelier-car-v1.glb')
      .then(gltf=>gltf.scene)
      .catch(error=>{ modelPromise=undefined; throw error; })
      .finally(()=>decoder.dispose());
  }
  return modelPromise;
}

function styleMaterials(model,ownedMaterials) {
  const copies = new Map();
  model.traverse(node=>{
    if (!node.isMesh) return;
    node.castShadow=true;
    node.receiveShadow=true;
    const recolor=original=>{
      if (copies.has(original)) return copies.get(original);
      const material=original.clone();
      copies.set(original,material);
      ownedMaterials.add(material);
      const name=material.name;
      material.envMapIntensity=.85;
      // The source uses emissive masks on rubber seals and wheels. Those masks
      // were removed with the textures; retaining their white factor lights
      // entire parts up. Only the actual lamp materials should emit light.
      material.emissive?.set(0x000000);
      material.emissiveIntensity=0;
      if (/Paint 1/.test(name)) {
        material.color.set('#9eafa1');
        material.metalness=.72;
        material.roughness=.25;
        material.clearcoat=1;
        material.clearcoatRoughness=.18;
        material.iridescence=0;
      } else if (/Paint 2/.test(name)) {
        material.color.set('#37443d');
        material.metalness=.65;
        material.roughness=.3;
        material.iridescence=0;
      } else if (/Interior/.test(name)) {
        material.color.set('#3d423e');
        material.roughness=.75;
        material.metalness=.05;
      } else if (/Glass/.test(name)) {
        // A single translucent surface avoids an expensive transmission render pass.
        material.color.set('#5b716a');
        material.transmission=0;
        material.transparent=true;
        material.opacity=.32;
        material.depthWrite=false;
        material.metalness=.15;
        material.roughness=.12;
      } else if (/Rim/.test(name)) {
        material.color.set(/Rim2/.test(name)?'#747d76':'#303933');
        material.metalness=.88;
        material.roughness=.32;
        material.envMapIntensity=.4;
      } else if (/Tireside|Tiretread/.test(name)) {
        material.color.set('#181b19');
        material.metalness=0;
        material.roughness=.82;
      } else if (/Mechanical|Hardware/.test(name)) {
        material.color.set(/Hardware/.test(name)?'#626a64':'#353b37');
        material.metalness=.55;
        material.roughness=.45;
      } else if (/Disc/.test(name)) {
        material.color.set('#7e867f');
        material.metalness=.8;
        material.roughness=.5;
      } else if (/Brake/.test(name)) {
        material.color.set('#3f4841');
        material.metalness=.45;
        material.roughness=.45;
      } else if (/License/.test(name)) {
        material.color.set('#bdc5bb');
        material.metalness=.25;
        material.roughness=.4;
      } else if (/Headlight|Brakelight|Signallight/.test(name)) {
        const lightColor=/Headlight/.test(name)?'#eef3e7':/Brakelight/.test(name)?'#ba3022':'#c47d2d';
        material.color.set(lightColor);
        material.emissive?.set(lightColor);
        material.emissiveIntensity=.65;
      }
      return material;
    };
    node.material=Array.isArray(node.material)?node.material.map(recolor):recolor(node.material);
  });
}

function assembleModel(template,view) {
  const model=template.clone(true);
  styleMaterials(model,view.materials);
  // The source root is both a mesh and parent. Separate its underside mesh so
  // hiding the chassis at t=0 cannot hide every later component as well.
  const original=model.getObjectByName('BodyUnderside');
  const root=new THREE.Group();
  root.name='AssemblyRoot';
  root.position.copy(original.position);
  root.quaternion.copy(original.quaternion);
  root.scale.copy(original.scale);
  const base=new THREE.Mesh(original.geometry,original.material);
  base.name='AssemblyChassis'; base.castShadow=true; base.receiveShadow=true;
  root.add(base);
  [...original.children].forEach(child=>root.add(child));
  original.parent.add(root);
  original.removeFromParent();

  const bounds=new THREE.Box3().setFromObject(model);
  const center=bounds.getCenter(new THREE.Vector3());
  const size=bounds.getSize(new THREE.Vector3());
  model.position.set(-center.x,-bounds.min.y,-center.z);
  view.turntable.add(model);
  view.length=Math.max(size.x,size.z);
  view.height=size.y;

  const schedule=(node,start,duration,offset=[0,0,0],hinge=0)=>{
    if (!node) return;
    view.parts.push({node,start,duration,offset:new THREE.Vector3(...offset),
      position:node.position.clone(),quaternion:node.quaternion.clone(),hinge});
    node.visible=false;
  };
  // Model coordinates are X across the car, Y along it, Z up. The source
  // hierarchy includes real door/hood pivots, so attached details move together.
  schedule(base,225,650,[0,0,-.14]);
  [...root.children].filter(node=>node!==base).forEach(node=>{
    const name=node.name;
    if (name==='Axles' || /^InteriorFloor/.test(name)) {
      schedule(node,225,650,[0,0,-.14]);
    } else if (name==='Engine') {
      schedule(node,475,800,[0,0,.65]);
    } else if (/^WheelRear/.test(name)) {
      schedule(node,675,900,[name.endsWith('L')?.65:-.65,0,.035]);
    } else if (/^WheelFront/.test(name)) {
      schedule(node,825,900,[name.endsWith('L')?.65:-.65,0,.035]);
    } else if (/^BodyDoor/.test(name)) {
      const left=name.includes('DoorL');
      schedule(node,left?1500:1560,800,[left?.22:-.22,0,.02],left?-.52:.52);
    } else if (name==='BodyHood') {
      schedule(node,1750,800,[0,0,.12],.38);
    } else if (/Windshield/.test(name)) {
      schedule(node,1325,800,[0,0,.32]);
    } else if (/Roof|Pillars|InteriorCage|InteriorPillar/.test(name)) {
      schedule(node,1125,800,[0,0,.62]);
    } else if (/^Interior/.test(name)) {
      schedule(node,600,800,[0,0,.45]);
    } else if (name==='License_Plate' || name==='License Plate') {
      schedule(node,1750,650,[0,-.15,0]);
    } else {
      schedule(node,900,800,[0,0,.38]);
    }
  });
  view.model=model;
}

function resize(view) {
  if (view.disposed) return;
  const {width,height}=view.stage.getBoundingClientRect();
  if (!width || !height) return;
  view.renderer.setSize(width,height,false);
  view.camera.aspect=width/height;
  view.camera.updateProjectionMatrix();
  if (view.ready) draw(view,view.time);
}

function draw(view,time) {
  if (!view.ready || view.disposed || view.failed) return;
  view.time=time;
  // A continuous 148-degree turn reveals different sides while parts fit.
  // Deceleration finishes only after the hood and doors are completely closed.
  view.turntable.rotation.y=THREE.MathUtils.lerp(Math.PI*.18,Math.PI,smooth(time/2880));
  // Leave headroom for the raised roof during assembly, then approach the
  // completed car. Keep the viewing angle constant throughout the dolly.
  const distance=THREE.MathUtils.lerp(9.4,7,smooth((time-1600)/1250));
  view.camera.position.set(distance,.65+distance*(1.55/7),0);
  view.camera.lookAt(0,.65,0);
  const hingeAxis=new THREE.Vector3(0,0,1);
  const hoodAxis=new THREE.Vector3(1,0,0);
  const rotation=new THREE.Quaternion();
  for (const part of view.parts) {
    const progress=smooth((time-part.start)/part.duration);
    const remaining=1-progress;
    part.node.visible=time>=part.start;
    part.node.position.copy(part.position).addScaledVector(part.offset,remaining);
    part.node.quaternion.copy(part.quaternion);
    if (part.hinge) {
      rotation.setFromAxisAngle(part.node.name==='BodyHood'?hoodAxis:hingeAxis,part.hinge*remaining);
      part.node.quaternion.multiply(rotation);
    }
  }
  view.shadow.opacity=.12*smooth(time/900);
  view.renderer.render(view.scene,view.camera);
}

function mount(engine) {
  const stage=engine.artHost.querySelector('.at-stage');
  const view={stage,parts:[],materials:new Set(),ready:false,failed:false,disposed:false,time:engine.time};
  views.set(engine,view);
  // A headless DOM and older devices can retain the existing photographic scene.
  if (!window.WebGL2RenderingContext) { view.failed=true; view.ready=true; return; }
  try {
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
    view.renderer=renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<600?1.25:1.5));
    renderer.setClearColor(0x000000,0);
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=.95;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.domElement.className='at-webgl';
    renderer.domElement.setAttribute('aria-hidden','true');
    stage.appendChild(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost',event=>{
      event.preventDefault(); view.failed=true; stage.classList.remove('at-3d-ready');
    });
    const scene=new THREE.Scene();
    view.scene=scene;
    const pmrem=new THREE.PMREMGenerator(renderer);
    const room=new RoomEnvironment();
    view.environment=pmrem.fromScene(room,.04);
    scene.environment=view.environment.texture;
    scene.environmentIntensity=.85;
    room.dispose(); pmrem.dispose();
    const sky=new THREE.HemisphereLight(0xffffff,0x687266,1.35);
    scene.add(sky);
    const key=new THREE.DirectionalLight(0xfffcf2,2.4);
    key.position.set(3,6,2);
    key.castShadow=true;
    key.shadow.mapSize.set(1024,1024);
    Object.assign(key.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.1,far:15});
    key.shadow.bias=-.0005;
    key.shadow.normalBias=.025;
    scene.add(key);
    const rim=new THREE.DirectionalLight(0xeaf4ef,1.4);
    rim.position.set(-4,3,-3); scene.add(rim);
    view.turntable=new THREE.Group(); scene.add(view.turntable);
    view.camera=new THREE.PerspectiveCamera(30,1.5,.1,40);
    view.camera.position.set(9.4,2.73,0);
    view.camera.lookAt(0,.65,0);
    const floorGeometry=new THREE.PlaneGeometry(20,20);
    const floorMaterial=new THREE.ShadowMaterial({color:0x24382a,opacity:.12});
    const floor=new THREE.Mesh(floorGeometry,floorMaterial);
    floor.rotation.x=-Math.PI/2;floor.position.y=-.015;floor.receiveShadow=true;
    scene.add(floor);
    view.floorGeometry=floorGeometry;view.shadow=floorMaterial;
    view.observer=new ResizeObserver(()=>resize(view));
    view.observer.observe(stage);
    resize(view);
  } catch(error) {
    view.failed=true; view.ready=true;
    release(view);
    console.warn('Using photographic opening because 3D rendering is unavailable.',error);
  }
}

function release(view) {
  if (view.released) return;
  view.released=true;
  view.observer?.disconnect();
  view.materials.forEach(material=>material.dispose());
  view.floorGeometry?.dispose(); view.shadow?.dispose();
  view.environment?.dispose();
  view.scene?.traverse(node=>{ if(node.isLight) node.dispose?.(); });
  if (view.renderer) {
    view.renderer.dispose(); view.renderer.forceContextLoss();
    view.renderer.domElement.remove();
  }
}

async function prepare(engine) {
  const view=views.get(engine);
  if (!view || view.failed) return photographicScene.prepare();
  if (view.preparation) return view.preparation;
  view.preparation=(async()=>{
    try {
      const template=await loadModel();
      if (view.disposed) return;
      assembleModel(template,view);
      // Compile every component once, before the clock starts. Rendering during
      // assembly then introduces no new materials or surprise shader compilation.
      view.parts.forEach(part=>{part.node.visible=true;});
      await view.renderer.compileAsync(view.scene,view.camera);
      if (view.disposed) return;
      view.ready=true;
      view.stage.classList.add('at-3d-ready');
      draw(view,engine.time);
    } catch(error) {
      view.failed=true; view.ready=true;
      release(view);
      await photographicScene.prepare();
      console.warn('Using photographic opening because the 3D model could not load.',error);
    }
  })();
  return view.preparation;
}

window.AtelierScene={
  artwork:photographicScene.artwork,
  timeline:photographicScene.timeline,
  mount,
  prepare,
  isPrepared(engine) {
    const view=views.get(engine);
    return view?.failed ? photographicScene.isReady : view?.ready || false;
  },
  update(engine,time) { const view=views.get(engine); if(view) draw(view,time); },
  unmount(engine) {
    const view=views.get(engine);
    if (!view) return;
    view.disposed=true;
    release(view);
    views.delete(engine);
  }
};
