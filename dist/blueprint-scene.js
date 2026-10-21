/* Photographic, perspective assembly scene used only by direction 02. */
(() => {
  'use strict';
  const sedan = 'images/blueprint-sedan-v2.webp';
  const chassis = 'images/blueprint-chassis-v2.webp';
  const shapes = {
    cabin:'M155 392L194 352Q365 214 595 229Q878 217 1076 365L1139 396L1112 412L628 417L590 403Z',
    rearDoor:'M191 400L384 405L357 483L351 708L210 677L179 541Z',
    frontDoor:'M384 404L626 413L599 503L626 750L351 708L356 485Z',
    hood:'M628 415L1120 393Q1328 401 1413 490L1454 519L1124 541L825 501L709 477Z',
    bumper:'M825 501L1124 541L1454 519L1496 556L1518 751L1460 781L917 786L858 762L855 633Z'
  };
  const wheels = '<ellipse cx="141" cy="628" rx="79" ry="128" transform="rotate(-8 141 628)"/><ellipse cx="747" cy="686" rx="123" ry="164" transform="rotate(-9 747 686)"/>';
  const pathShapes = Object.entries(shapes).map(([key,d])=>`<path data-shape="${key}" d="${d}"/>`).join('');
  function artwork(id) {
    const use = `<use href="#${id}-photo"/>`;
    const pieces = [
      `<g class="bp-part bp-shell" data-bp-part="shell" mask="url(#${id}-shell-mask)">${use}</g>`,
      ...Object.keys(shapes).map(key=>`<g class="bp-part" data-bp-part="${key}"><g clip-path="url(#${id}-${key})">${use}</g></g>`),
      `<g class="bp-part" data-bp-part="rearWheel"><g clip-path="url(#${id}-rear-wheel)">${use}</g></g>`,
      `<g class="bp-part" data-bp-part="frontWheel"><g clip-path="url(#${id}-front-wheel)">${use}</g></g>`
    ].join('');
    return `<div class="bp-camera"><svg class="bp-svg" viewBox="0 0 1536 1024" fill="none" aria-hidden="true">
      <defs>
        <image id="${id}-photo" href="${sedan}" width="1536" height="1024"/>
        ${Object.entries(shapes).map(([key,d])=>`<clipPath id="${id}-${key}"><path d="${d}"/></clipPath>`).join('')}
        <clipPath id="${id}-rear-wheel"><ellipse cx="141" cy="628" rx="79" ry="128" transform="rotate(-8 141 628)"/></clipPath>
        <clipPath id="${id}-front-wheel"><ellipse cx="747" cy="686" rx="123" ry="164" transform="rotate(-9 747 686)"/></clipPath>
        <mask id="${id}-shell-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024"><rect width="1536" height="1024" fill="white"/><g fill="black">${pathShapes}${wheels}</g></mask>
        <mask id="${id}-core-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024"><rect width="1536" height="1024" fill="white"/><g fill="black">${wheels}</g></mask>
        <filter id="${id}-edge" color-interpolation-filters="sRGB" x="-5%" y="-5%" width="110%" height="110%"><feColorMatrix type="saturate" values="0"/><feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true"/><feColorMatrix type="luminanceToAlpha" result="edge"/><feComponentTransfer in="edge" result="strong"><feFuncA type="linear" slope="2.4"/></feComponentTransfer><feFlood flood-color="#8cdcff"/><feComposite in2="strong" operator="in"/></filter>
        <filter id="${id}-light"><feGaussianBlur stdDeviation="5"/></filter>
        <linearGradient id="${id}-beam"><stop stop-color="#b3eaff" stop-opacity=".28"/><stop offset="1" stop-color="#76d0ff" stop-opacity="0"/></linearGradient>
        <linearGradient id="${id}-sweep"><stop stop-color="#e0f9ff" stop-opacity="0"/><stop offset=".5" stop-color="#e0f9ff" stop-opacity=".38"/><stop offset="1" stop-color="#e0f9ff" stop-opacity="0"/></linearGradient>
        <mask id="${id}-vehicle-alpha" mask-type="alpha">${use}</mask>
        <radialGradient id="${id}-shadow"><stop stop-color="#000" stop-opacity=".85"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
        <linearGradient id="${id}-reflection-fade" x1="0" y1="845" x2="0" y2="1024" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity=".65"/><stop offset="1" stop-color="black"/></linearGradient>
        <mask id="${id}-reflection-mask" maskUnits="userSpaceOnUse" x="0" y="840" width="1536" height="184"><rect y="840" width="1536" height="184" fill="url(#${id}-reflection-fade)"/></mask>
      </defs>
      <ellipse class="bp-contact-shadow" cx="800" cy="817" rx="720" ry="73" fill="url(#${id}-shadow)"/>
      <g class="bp-reflection" mask="url(#${id}-reflection-mask)"><g transform="translate(0 1700) scale(1 -1)">${use}</g></g>
      <g class="bp-wire-photo" filter="url(#${id}-edge)">${use}</g>
      <g class="bp-technical" stroke="#77cbf5" stroke-width="1.1" stroke-linejoin="round">
        <path class="bp-outline" pathLength="1" d="M34 552L46 435L170 389Q382 213 594 230Q874 216 1084 365L1158 391Q1399 410 1470 515L1508 583L1506 746L1468 778L884 801M629 753L218 698M39 569L35 674L71 712"/>
        <path class="bp-outline" pathLength="1" d="M180 388L623 412L1132 400M384 405L353 702M624 411L596 509L627 745M627 414L820 500L1124 540L1450 520M829 501L862 632L861 760M1124 540L1147 763M67 745L209 753M634 842L865 838"/>
        <g opacity=".5" stroke-dasharray="4 9"><path d="M59 775L1457 843M116 478L723 530L1491 592M140 466V814M746 479V893M1432 495V835"/></g>
        <ellipse cx="141" cy="628" rx="79" ry="128" transform="rotate(-8 141 628)"/><ellipse cx="747" cy="686" rx="123" ry="164" transform="rotate(-9 747 686)"/>
        <ellipse cx="141" cy="628" rx="58" ry="101" transform="rotate(-8 141 628)"/><ellipse cx="747" cy="686" rx="95" ry="133" transform="rotate(-9 747 686)"/>
      </g>
      <g class="bp-core" mask="url(#${id}-core-mask)"><image href="${chassis}" width="1536" height="1024"/></g>
      <g class="bp-parts">${pieces}</g>
      <g class="bp-finished">${use}</g>
      <g class="bp-paint-sheen" mask="url(#${id}-vehicle-alpha)"><path d="M-350 150L-180 150L-490 950L-660 950Z" fill="url(#${id}-sweep)"/></g>
      <g class="bp-headlights"><path d="M857 516L1108 542M1439 518L1468 498" stroke="#e8fbff" stroke-width="5"/><path d="M857 516L1108 542M1439 518L1468 498" stroke="#b6e7ff" stroke-width="20" opacity=".6" filter="url(#${id}-light)"/><path d="M1090 542L1536 631L1536 817Z" fill="url(#${id}-beam)" opacity=".35"/></g>
      <g class="bp-scan"><path d="M0 140V884" stroke="#c5f2ff" stroke-width="2"/><path d="M-24 140H24V884H-24Z" fill="#7cceff" opacity=".06"/></g>
      <g class="bp-callouts" fill="#8cb5cc" font-family="monospace" font-size="12" letter-spacing="2"><path d="M165 405L135 312H57M1195 447L1288 303H1455M716 774L685 901H490" stroke="#6cb1d0" stroke-width="1" fill="none"/><text x="55" y="293">01 / BODY STRUCTURE</text><text x="1262" y="284">02 / POWERTRAIN</text><text x="490" y="925">03 / PRECISION FIT</text><circle cx="165" cy="405" r="4" fill="#b5eaff"/><circle cx="1195" cy="447" r="4" fill="#b5eaff"/><circle cx="716" cy="774" r="4" fill="#b5eaff"/></g>
    </svg></div>`;
  }
  const environment = `<div class="bp-room-light"></div><div class="bp-floor"><div class="bp-floor-grid"></div><div class="bp-ground-glow"></div><div class="bp-ground-ring"></div></div><div class="bp-light-shaft shaft-left"></div><div class="bp-light-shaft shaft-right"></div><div class="bp-haze"></div><div class="bp-dust">${Array.from({length:12},(_,i)=>`<i style="--x:${8+i*7.2}%;--y:${25+(i*19)%43}%;--s:${i%3+1}px"></i>`).join('')}</div><div class="bp-corner corner-tl"></div><div class="bp-corner corner-br"></div>`;
  function timeline(engine) {
    const a = engine.animate.bind(engine);
    a('.scene-heading',[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],100,1100);
    a('.scene-topline',[{opacity:0},{opacity:1}],0,1000);
    a('.bp-room-light',[{opacity:0},{opacity:.85,offset:.35},{opacity:.4}],0,8200);
    a('.bp-floor',[{opacity:0,transform:'translateY(35px)'},{opacity:1,transform:'translateY(0)'}],0,1800);
    a('.bp-ground-ring',[{opacity:0,transform:'translate(-50%,-50%) scale(.4)'},{opacity:.7,offset:.3},{opacity:0,transform:'translate(-50%,-50%) scale(1.7)'}],200,3100);
    a('.bp-haze',[{opacity:.1,transform:'translateX(-5%)'},{opacity:.4,transform:'translateX(5%)'}],0,8200,{easing:'linear'});
    a('.shaft-left',[{opacity:0,transform:'rotate(-24deg) translateX(-20px)'},{opacity:.5,offset:.4},{opacity:.25,transform:'rotate(-17deg) translateX(20px)'}],300,7300);
    a('.shaft-right',[{opacity:0},{opacity:.32,offset:.5},{opacity:.16}],1000,6500);
    a('.bp-dust',[{opacity:0,transform:'translateY(15px)'},{opacity:.55,offset:.3},{opacity:.35,transform:'translateY(-15px)'}],0,8200,{easing:'linear'});
    a('.bp-camera',[
      {transform:'translate3d(-1.5%,3%,0) scale(.87) rotate(-.6deg)'},
      {transform:'translate3d(0,0,0) scale(.98) rotate(0deg)',offset:.68},
      {transform:'translate3d(-1.5%,-1%,0) scale(1.035) rotate(0deg)'}
    ],0,8200,{easing:'cubic-bezier(.2,.55,.3,1)'});
    a('.bp-wire-photo',[{opacity:0},{opacity:.85,offset:.25},{opacity:.45,offset:.6},{opacity:0}],0,5100);
    a('.bp-technical',[{opacity:0},{opacity:.65,offset:.2},{opacity:.65,offset:.65},{opacity:0}],0,4900);
    engine.scene.querySelectorAll('.bp-outline').forEach(node=>{
      const animation=node.animate([{strokeDasharray:'1',strokeDashoffset:'1'},{strokeDasharray:'1',strokeDashoffset:'0'}],{duration:2000,delay:150,fill:'both',easing:'ease-in-out'});
      animation.pause();animation.currentTime=0;engine.animations.push(animation);
    });
    a('.bp-scan',[{opacity:0,transform:'translateX(40px)'},{opacity:.8,offset:.08},{opacity:.65,offset:.8},{opacity:0,transform:'translateX(1510px)'}],300,5700,{easing:'linear'});
    a('.bp-callouts',[{opacity:0},{opacity:.7,offset:.25},{opacity:.7,offset:.65},{opacity:0}],400,5100);
    a('.bp-core',[{opacity:0,transform:'translateY(40px)',filter:'brightness(.65)'},{opacity:1,transform:'translateY(0)',filter:'brightness(.95)',offset:.28},{opacity:1,offset:.7},{opacity:0,transform:'translateY(0)',filter:'brightness(.95)'}],850,5650);
    const motions = {
      shell:{start:2600,duration:2350,x:0,y:-70,rotation:0,scale:1.04},
      cabin:{start:2850,duration:2200,x:-15,y:-150,rotation:-1.5,scale:1.025},
      rearDoor:{start:3300,duration:2100,x:-105,y:25,rotation:-2,scale:1.03},
      frontDoor:{start:3650,duration:2000,x:-55,y:55,rotation:1,scale:1.025},
      hood:{start:3950,duration:1850,x:70,y:-110,rotation:-2,scale:1.025},
      bumper:{start:4450,duration:1900,x:140,y:30,rotation:1.5,scale:1.02},
      rearWheel:{start:1400,duration:1950,x:-165,y:45,rotation:-18,scale:1.06},
      frontWheel:{start:1750,duration:2050,x:155,y:55,rotation:18,scale:1.075}
    };
    Object.entries(motions).forEach(([name,m])=>{
      a(`[data-bp-part="${name}"]`,[
        {opacity:0,transform:`translate(${m.x}px,${m.y}px) rotate(${m.rotation}deg) scale(${m.scale})`,filter:'brightness(.7) blur(2px)'},
        {opacity:.94,offset:.32},
        {opacity:1,transform:'translate(0,0) rotate(0deg) scale(1)',filter:'brightness(1) blur(0px)'}
      ],m.start,m.duration,{easing:'cubic-bezier(.19,.8,.22,1)'});
    });
    a('.bp-finished',[{opacity:0},{opacity:1}],6200,500);
    a('.bp-parts',[{opacity:1},{opacity:0}],6200,500);
    a('.bp-contact-shadow',[{opacity:0},{opacity:1}],900,3700);
    a('.bp-reflection',[{opacity:0},{opacity:0,offset:.68},{opacity:.13}],0,7000);
    a('.bp-paint-sheen',[{opacity:0,transform:'translateX(300px)'},{opacity:1,offset:.15},{opacity:1,offset:.8},{opacity:0,transform:'translateX(2050px)'}],6000,1550,{easing:'ease-in-out'});
    a('.bp-headlights',[{opacity:0},{opacity:1,offset:.3},{opacity:.82}],6800,1100);
  }
  window.BlueprintScene = {artwork,environment,timeline};
})();
