/* Direction 01: short, mechanically guided assembly in the original order. */
(() => {
  'use strict';
  const assets = window.atelierAssets;
  let ready = false, preparation;
  function prepare() {
    if (!preparation) {
      const sources = [assets.photo.src,...Object.values(assets.parts).map(p=>p.src)];
      preparation = Promise.all(sources.map(src=>new Promise(resolve=>{
        const image = new Image();
        image.onerror = resolve;
        if (!image.decode) image.onload = resolve;
        image.src = src;
        if (image.decode) image.decode().then(resolve,resolve);
      }))).then(()=>{ ready = true; });
    }
    return preparation;
  }
  const fullPicture=(src,className)=>`<img class="${className}" src="${src}" width="1536" height="1024" alt="" decoding="async" draggable="false">`;
  function artwork() {
    prepare();
    const part=name=>{
      const p=assets.parts[name];
      const image=`<img src="${p.src}" width="${p.width}" height="${p.height}" alt="" decoding="async" draggable="false">`;
      const contents=name==='door'?`<div class="at-door-leaf at-door-rear">${image}</div><div class="at-door-leaf at-door-front">${image}</div>`:image;
      return `<div class="at-part" data-at-part="${name}" style="left:${p.x/15.36}%;top:${p.y/10.24}%;width:${p.width/15.36}%;height:${p.height/10.24}%">${contents}</div>`;
    };
    return `<div class="at-stage" aria-hidden="true">
      <div class="at-shadow"></div>
      <svg class="at-fixtures" viewBox="0 0 1536 1024" fill="none"><defs><linearGradient id="at-support-steel"><stop stop-color="#7a8580"/><stop offset=".45" stop-color="#c7cdc5"/><stop offset="1" stop-color="#65726b"/></linearGradient></defs><g fill="url(#at-support-steel)" stroke="#65726b" stroke-width="1"><path d="M478 693h18v54h-18zM461 747h52v7h-52zM465 688h44v8h-44z"/><path d="M1006 693h18v54h-18zM989 747h52v7h-52zM993 688h44v8h-44z"/></g></svg>
      <div class="at-car">
        <div class="at-parts"><div class="at-mechanics">${part('chassis')}${part('engine')}</div>${['interior','body','roof','glass','door','rearWheel','frontWheel','trim'].map(part).join('')}</div>
        ${fullPicture(assets.photo.src,'at-finished at-full-layer')}
      </div>
    </div>`;
  }
  function timeline(engine) {
    const a=engine.animate.bind(engine);
    // Distances use the source photo's coordinates, independent of the viewport.
    // Wheels approach along their axles; seats/engine lower vertically into the base.
    const fitting={
      chassis:{x:0,y:28}, engine:{x:0,y:-86,tilt:-1.5}, interior:{x:0,y:-70},
      body:{x:0,y:-36}, roof:{x:0,y:-72}, glass:{x:0,y:-24,depth:4,scale:1.025},
      door:{x:0,y:0}, rearWheel:{x:-14,y:0,depth:-14,scale:1.13},
      frontWheel:{x:14,y:0,depth:14,scale:1.13}, trim:{x:25,y:0}
    };
    const starts={chassis:450,engine:950,interior:1200,body:1800,roof:2250,glass:2650,door:3000,rearWheel:1350,frontWheel:1650,trim:3500};
    const motion={easing:'linear'};
    // Preserve the original chronological order, including wheels before the body.
    const order=Object.keys(starts).sort((left,right)=>starts[left]-starts[right]);
    order.forEach(name=>{
      const m=fitting[name];
      const p=assets.parts[name];
      const selector=`[data-at-part="${name}"]`;
      const start=starts[name]*.5;
      const duration=name.includes('Wheel')?900:800;
      const position=remaining=>`perspective(1000px) translate3d(${m.x*remaining/p.width*100}%,${m.y*remaining/p.height*100}%,0) rotateY(${(m.depth||0)*remaining}deg) rotateZ(${(m.tilt||0)*remaining}deg) scale(${1+((m.scale||1)-1)*remaining})`;
      // Approach, align just short of the mount, then press the final few millimetres.
      a(selector,[
        {transform:position(1),offset:0,easing:'cubic-bezier(.4,0,.35,1)'},
        {transform:position(.045),offset:.78,easing:'cubic-bezier(.25,0,.45,1)'},
        {transform:position(0),offset:1}
      ],start,duration,motion);
      // A brief entrance keeps the solid parts readable for the rest of their travel.
      a(selector,[{opacity:0},{opacity:1}],start,120,{easing:'ease-in-out'});
    });
    a('.at-door-rear',[
      {transform:'perspective(1000px) rotateY(-28deg)'},
      {transform:'perspective(1000px) rotateY(0deg)'}
    ],1500,760,{easing:'cubic-bezier(.4,0,.3,1)'});
    a('.at-door-front',[
      {transform:'perspective(1000px) rotateY(-24deg)'},
      {transform:'perspective(1000px) rotateY(0deg)'}
    ],1560,800,{easing:'cubic-bezier(.4,0,.3,1)'});
    a('.at-shadow',[{opacity:0},{opacity:1}],150,900);
    a('.scene-heading',[{opacity:0},{opacity:1}],0,200);
    a('.scene-topline',[{opacity:0},{opacity:1}],0,150);
    // As the shell seats, its silhouette occludes the taller exposed mechanical parts.
    // Keep the lower structure visible through the door apertures until they close.
    const silhouette=[[0,450],[174,411],[337,343],[467,307],[640,294],[770,294],[895,313],[981,343],[1100,438],[1367,477],[1483,516],[1517,563],[1517,700],[0,700]];
    const outline=points=>`polygon(${points.map(([x,y])=>`${x/15.36}% ${y/10.24}%`).join(',')})`;
    const open=silhouette.map(([x],i)=>[x,i<12?0:1024]);
    a('.at-mechanics',[{clipPath:outline(open)},{clipPath:outline(silhouette)}],1460,240,{easing:'ease-in-out'});
    a('.at-fixtures',[{opacity:0},{opacity:1}],100,180,{easing:'ease-in-out'});
    a('.at-fixtures',[{opacity:1,transform:'translate3d(0,0,0)'},{opacity:0,transform:'translate3d(0,1.5%,0)'}],1725,220,{easing:'ease-in-out',fill:'forwards'});
    a('.at-finished',[{opacity:0},{opacity:1}],2550,250,{easing:'ease-in-out'});
    // Keep the parts underneath until the full photo is opaque, avoiding a fade dip.
    a('.at-parts',[{opacity:1},{opacity:0}],2800,100,{easing:'ease-in-out'});
  }
  window.AtelierScene={artwork,timeline,prepare,get isReady(){return ready;}};
})();
