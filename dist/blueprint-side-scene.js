/* Direction 02: side-elevation photography on pre-rendered, composited layers. */
(() => {
  'use strict';
  const assets = window.blueprintSideAssets;
  let ready = false, preparation;
  function prepare() {
    if (!preparation) {
      const sources = [...new Set([assets.photo.src,assets.core.src,assets.wire.src,...Object.values(assets.parts).map(p=>p.src)])];
      preparation = Promise.all(sources.map(src => new Promise(resolve => {
        const image = new Image();
        image.onerror = resolve;
        if (!image.decode) image.onload = resolve;
        image.src = src;
        if (image.decode) image.decode().then(resolve,resolve);
      }))).then(() => { ready = true; });
    }
    return preparation;
  }
  const picture = (src, className='') => `<img class="${className}" src="${src}" width="1536" height="1024" alt="" decoding="async" draggable="false">`;
  function artwork() {
    prepare();
    const parts = Object.entries(assets.parts).map(([name,p])=>`<div class="bp-part" data-bp-part="${name}" style="left:${p.x/15.36}%;top:${p.y/10.24}%;width:${p.width/15.36}%;height:${p.height/10.24}%"><img src="${p.src}" width="${p.width}" height="${p.height}" alt="" decoding="async" draggable="false"></div>`).join('');
    return `<div class="bp-camera bp-side-stage" aria-hidden="true">
      <div class="bp-contact-shadow"></div>
      <div class="bp-reflection">${picture(assets.photo.src)}</div>
      ${picture(assets.wire.src,'bp-wire-photo bp-full-layer')}
      <svg class="bp-svg bp-technical" viewBox="0 0 1536 1024" fill="none" stroke="#8bd2f1" stroke-width="1.1" stroke-linejoin="round">
        <path class="bp-outline" pathLength="1" d="M30 551L50 463L60 430L175 408L337 343Q467 296 640 294H770Q895 295 981 343L1100 438Q1367 445 1483 516L1511 562V669L1380 684M1144 687H442M209 676L54 657L29 614Z"/>
        <path class="bp-outline" pathLength="1" d="M174 411L396 422L1055 438M406 421Q373 445 384 471L477 653L1071 668M697 431L727 657M1058 438Q1087 460 1079 529L1071 668M1097 438L1162 482L1379 538L1496 523"/>
        <circle cx="325" cy="628" r="116"/><circle cx="1260" cy="628" r="116"/><circle cx="325" cy="628" r="90"/><circle cx="1260" cy="628" r="90"/>
        <g opacity=".35" stroke-dasharray="5 10"><path d="M56 778H1484M325 261V805M1260 261V805M56 489H1484"/></g>
        <g class="bp-callouts" stroke="#609db9" stroke-width="1" fill="none"><path d="M537 323L489 234H274M1181 478L1231 306H1423M325 731L276 853H110"/><g fill="#8cb5cc" stroke="none" font-family="monospace" font-size="12" letter-spacing="2"><text x="274" y="216">01 / BODY STRUCTURE</text><text x="1225" y="287">02 / POWERTRAIN</text><text x="110" y="876">03 / PRECISION FIT</text></g></g>
      </svg>
      ${picture(assets.core.src,'bp-core bp-full-layer')}
      <div class="bp-parts">${parts}</div>
      ${picture(assets.photo.src,'bp-finished bp-full-layer')}
      <div class="bp-paint-sheen"><div class="bp-sheen-light"></div></div>
      <svg class="bp-svg bp-headlights" viewBox="0 0 1536 1024" fill="none"><path d="M1387 515L1490 535" stroke="#e6faff" stroke-width="3"/><path d="M1387 515L1490 535" stroke="#b2e3ff" stroke-width="11" opacity=".2"/><path d="M52 470L140 470" stroke="#ff6878" stroke-width="2" opacity=".8"/></svg>
      <div class="bp-scan"><i></i></div>
    </div>`;
  }
  const environment = `<div class="bp-room-light"></div><div class="bp-floor"><div class="bp-floor-grid"></div><div class="bp-ground-glow"></div><div class="bp-ground-ring"></div></div><div class="bp-light-shaft shaft-left"></div><div class="bp-light-shaft shaft-right"></div><div class="bp-haze"></div><div class="bp-dust">${Array.from({length:8},(_,i)=>`<i style="--x:${10+i*11}%;--y:${25+(i*19)%43}%;--s:${i%2+1}px"></i>`).join('')}</div><div class="bp-corner corner-tl"></div><div class="bp-corner corner-br"></div>`;
  function timeline(engine) {
    const a = engine.animate.bind(engine);
    const smooth = {easing:'cubic-bezier(.42,0,.2,1)'};
    a('.scene-heading',[{opacity:0,transform:'translate3d(0,8px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],80,1200,smooth);
    a('.scene-topline',[{opacity:0},{opacity:1}],0,1000,smooth);
    a('.bp-room-light',[{opacity:0},{opacity:.65}],0,3400,smooth);
    a('.bp-floor',[{opacity:0},{opacity:1}],0,2200,smooth);
    a('.bp-ground-ring',[{opacity:0,transform:'translate(-50%,-50%) scale(.65)'},{opacity:.5,offset:.4},{opacity:0,transform:'translate(-50%,-50%) scale(1.35)'}],150,3600,{easing:'linear'});
    a('.bp-haze',[{opacity:.1,transform:'translate3d(-2%,0,0)'},{opacity:.35,transform:'translate3d(2%,0,0)'}],0,8200,{easing:'linear'});
    a('.shaft-left',[{opacity:0},{opacity:.3}],0,4000,smooth);
    a('.shaft-right',[{opacity:0},{opacity:.2}],1000,4500,smooth);
    a('.bp-dust',[{opacity:0,transform:'translate3d(0,8px,0)'},{opacity:.4,transform:'translate3d(0,-8px,0)'}],0,8200,{easing:'linear'});
    a('.bp-camera',[{transform:'scale(.99)'},{transform:'scale(1.01)'}],0,8200,{easing:'ease-in-out'});
    a('.bp-wire-photo',[{opacity:0},{opacity:.8,offset:.24},{opacity:.55,offset:.62},{opacity:0}],0,5200,{easing:'linear'});
    a('.bp-technical',[{opacity:0},{opacity:.5,offset:.25},{opacity:.5,offset:.65},{opacity:0}],0,5200,{easing:'linear'});
    engine.scene.querySelectorAll('.bp-outline').forEach(node => {
      const animation = node.animate([{strokeDasharray:'1',strokeDashoffset:'1'},{strokeDasharray:'1',strokeDashoffset:'0'}],{duration:2600,delay:150,fill:'both',easing:'ease-in-out'});
      animation.pause(); animation.currentTime=0; engine.animations.push(animation);
    });
    a('.bp-scan',[{opacity:0,transform:'translate3d(3%,0,0)'},{opacity:.5,offset:.12},{opacity:.5,offset:.84},{opacity:0,transform:'translate3d(97%,0,0)'}],250,5700,{easing:'linear'});
    a('.bp-core',[{opacity:0},{opacity:1,offset:.18},{opacity:1,offset:.8},{opacity:0}],700,5900,{easing:'linear'});
    const motions = {
      rearWheel:{start:1100,duration:2800,x:-52,y:10,r:-28}, frontWheel:{start:1450,duration:2800,x:52,y:10,r:28},
      shell:{start:2300,duration:2900,x:0,y:-6,r:0}, cabin:{start:2550,duration:3000,x:0,y:-42,r:0},
      rearDoor:{start:2900,duration:2800,x:-28,y:3,r:0}, frontDoor:{start:3200,duration:2800,x:20,y:3,r:0},
      hood:{start:3500,duration:2700,x:8,y:-65,r:0}, bumper:{start:3800,duration:2600,x:52,y:0,r:0}
    };
    Object.entries(motions).forEach(([name,m]) => {
      const selector=`[data-bp-part="${name}"]`;
      a(selector,[{transform:`translate3d(${m.x}%,${m.y}%,0) rotate(${m.r}deg)`},{transform:'translate3d(0%,0%,0) rotate(0deg)'}],m.start,m.duration,smooth);
      a(selector,[{opacity:0},{opacity:1}],m.start,650,{easing:'ease-in-out'});
    });
    a('.bp-finished',[{opacity:0},{opacity:1}],6500,700,{easing:'linear'});
    a('.bp-parts',[{opacity:1},{opacity:0}],6500,700,{easing:'linear'});
    a('.bp-contact-shadow',[{opacity:0},{opacity:.85}],800,3300,smooth);
    a('.bp-reflection',[{opacity:0},{opacity:.12}],5100,2100,smooth);
    a('.bp-paint-sheen',[{opacity:0},{opacity:.7,offset:.25},{opacity:0}],6300,1600,{easing:'linear'});
    a('.bp-sheen-light',[{transform:'translate3d(-45%,0,0)'},{transform:'translate3d(135%,0,0)'}],6300,1600,{easing:'ease-in-out'});
    a('.bp-headlights',[{opacity:0},{opacity:.8}],6900,1100,smooth);
  }
  window.BlueprintScene = {artwork,environment,timeline,prepare,get isReady(){return ready;}};
})();
