/* Shared, dependency-free assembly scenes for the site and preview room. */
(() => {
  'use strict';
  const variants = {
    atelier: { number:'01', name:'アトリエ', english:'THE ATELIER', line:'ひとつひとつに、技術を。', steps:['部品を揃える','骨格を組む','ボディを仕上げる','走り出す準備ができました'], duration:6600 },
    blueprint: { number:'02', name:'ブループリント', english:'FROM THE BLUEPRINT', line:'精密さが、現実になる。', steps:['設計線が、空間に浮かぶ','構造が、動き出す','ひとつずつ、美しさに変わる','この一台を、次の走りへ。'], duration:8200 },
    orbit: { number:'03', name:'オービット', english:'EVERY PART, ONE PURPOSE', line:'すべての部品が、ひとつになる。', steps:['動き出すパーツ','引き寄せる技術','ひとつの美しさへ','走り出す準備ができました'], duration:6800 }
  };
  let instance = 0;
  const bodyPath = 'M128 306L151 277Q201 260 323 250L698 246L825 260Q868 263 888 291L905 329Q909 342 893 346L803 349C800 270 670 270 667 349L353 349C350 270 220 270 217 349L151 345Q128 342 128 326Z';
  function wheel(x) {
    const spokes = Array.from({length:10}, (_,i) => `<path d="M-5-14L-8-40L-2-43L6-15Z" fill="url(#ID-rim)" transform="rotate(${i*36})"/>`).join('');
    return `<g transform="translate(${x} 345)"><circle r="58" fill="#121e24"/><circle r="53" fill="none" stroke="#35444a" stroke-width="2"/><circle r="46" fill="url(#ID-rim)"/><circle r="41" fill="#1c2b31"/><circle r="33" fill="#697b80"/><circle r="29" fill="#33464c" stroke="#8b9b9c" stroke-width="1"/><path d="M26-20Q40-1 25 22L19 16Q30 0 19-14Z" fill="#da935c"/>${spokes}<circle r="14" fill="url(#ID-rim)" stroke="#c5d7d5"/><circle r="7" fill="#526d73"/>${Array.from({length:5},(_,i)=>`<circle cx="0" cy="-10" r="1.5" fill="#273f46" transform="rotate(${i*72})"/>`).join('')}<path d="M-37-40Q-4-61 32-43" stroke="#80938d" stroke-width="1.5" fill="none" opacity=".55"/></g>`;
  }
  function artwork(id) {
    return `<svg class="assembly-svg" viewBox="0 0 1040 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ID-paint" x1="500" y1="236" x2="500" y2="360" gradientUnits="userSpaceOnUse"><stop stop-color="#bce3df"/><stop offset=".22" stop-color="#81b8b7"/><stop offset=".47" stop-color="#487f85"/><stop offset=".6" stop-color="#659c9e"/><stop offset="1" stop-color="#294e59"/></linearGradient>
        <linearGradient id="ID-roof" x1="470" y1="169" x2="470" y2="255" gradientUnits="userSpaceOnUse"><stop stop-color="#d7ebe4"/><stop offset=".35" stop-color="#78aead"/><stop offset="1" stop-color="#365c67"/></linearGradient>
        <linearGradient id="ID-glass" x1="450" y1="185" x2="490" y2="254" gradientUnits="userSpaceOnUse"><stop stop-color="#4b747c"/><stop offset=".4" stop-color="#294952"/><stop offset="1" stop-color="#172d38"/></linearGradient>
        <linearGradient id="ID-rim" x1="-40" y1="-45" x2="30" y2="44" gradientUnits="userSpaceOnUse"><stop stop-color="#edf3e9"/><stop offset=".35" stop-color="#9caeae"/><stop offset=".65" stop-color="#d7e5dd"/><stop offset="1" stop-color="#697e83"/></linearGradient>
        <linearGradient id="ID-metal"><stop stop-color="#304951"/><stop offset=".5" stop-color="#a0b5b3"/><stop offset="1" stop-color="#3a535c"/></linearGradient>
        <linearGradient id="ID-sweep"><stop stop-color="white" stop-opacity="0"/><stop offset=".5" stop-color="#fffef0" stop-opacity=".6"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
        <radialGradient id="ID-shadow"><stop stop-color="#142f38" stop-opacity=".25"/><stop offset="1" stop-color="#142f38" stop-opacity="0"/></radialGradient>
        <radialGradient id="ID-glow"><stop stop-color="#ddffff" stop-opacity=".65"/><stop offset="1" stop-color="#c2ffff" stop-opacity="0"/></radialGradient>
        <clipPath id="ID-silhouette"><path d="${bodyPath}"/><path d="M323 250L388 188Q411 169 462 169L562 169Q597 169 623 190L698 246L674 247L611 201Q588 184 556 184L454 184Q421 184 406 199L346 250Z"/></clipPath>
      </defs>
      <g class="draft-lines" stroke="currentColor" stroke-width=".8" opacity=".24">
        <path d="M80 405H960M112 150H928M112 142V158M928 142V158M285 108V425M735 108V425" stroke-dasharray="4 6"/>
        <path d="M155 430H865M155 424V436M865 424V436M110 192V345M104 192H116M104 345H116"/>
        <g fill="currentColor" stroke="none" font-size="8" font-family="monospace" letter-spacing="2"><text x="463" y="447">PRECISION IN EVERY DETAIL</text><text x="115" y="136">SIDE ELEVATION / 01</text></g>
      </g>
      <ellipse class="car-shadow" cx="517" cy="407" rx="412" ry="22" fill="url(#ID-shadow)"/>
      <g class="car-motion">
        <g class="car-ghost" stroke="currentColor" stroke-width="1" opacity=".14"><path d="${bodyPath}"/><path d="M323 250L388 188Q411 169 462 169L562 169Q597 169 623 190L698 246"/><circle cx="285" cy="345" r="58"/><circle cx="735" cy="345" r="58"/></g>
        <g class="car-part" data-part="chassis"><path d="M183 329H841L855 350H168Z" fill="url(#ID-metal)" stroke="#2c464d"/><path d="M330 337H689M374 325V349M630 325V349" stroke="#b5c7c0" stroke-width="3"/><path d="M258 328L277 296H302L323 328M708 328L725 296H750L771 328" stroke="#7b9998" stroke-width="5"/><path d="M362 352H650" stroke="#132c35" stroke-width="7"/></g>
        <g class="car-part" data-part="engine"><path d="M724 279L734 258H783L800 273V308H719V285Z" fill="#718e91" stroke="#29444e" stroke-width="2"/><path d="M733 267H783M733 274H789M735 281H788" stroke="#c5d4cc" stroke-width="3"/><rect x="691" y="287" width="26" height="22" rx="3" fill="#b5bfb0"/><path d="M695 288V282H714V288M718 296H727" stroke="#42616b" stroke-width="3"/><path d="M777 305L815 315H852" stroke="#617d7e" stroke-width="5"/><circle cx="748" cy="299" r="10" fill="#223c46"/><circle cx="748" cy="299" r="5" stroke="#93b0af" stroke-width="2"/></g>
        <g class="car-part" data-part="interior"><path d="M401 269L408 214Q410 208 421 212L442 256H463V280H399M504 269L510 214Q512 208 523 212L544 256H565V280H502" fill="#a98e6d" stroke="#74664f" stroke-width="2"/><path d="M591 257L595 237M586 233L607 238M384 277H654" stroke="#2a414b" stroke-width="5"/></g>
        <g class="car-part" data-part="body"><path d="${bodyPath}" fill="url(#ID-paint)" stroke="#345960" stroke-width="1.2"/><path d="M144 288Q320 266 472 267L700 260Q819 269 876 286" stroke="#d5f1e5" stroke-width="2" opacity=".8"/><path d="M362 337H660" stroke="#c0dad1" stroke-width="2"/><path d="M364 345H659" stroke="#173f4c" stroke-width="5"/><path d="M222 329C235 264 335 268 348 331M671 330C686 265 786 270 799 331" stroke="#cee8dc" stroke-width="1.7" opacity=".7"/></g>
        <g class="car-part" data-part="roof"><path d="M323 250L388 188Q411 169 462 169L562 169Q597 169 623 190L698 246L674 250L611 201Q588 184 556 184L454 184Q421 184 406 199L346 250Z" fill="url(#ID-roof)" stroke="#456b71" stroke-width="1"/><path d="M394 188Q414 175 462 175H560Q593 175 615 194" stroke="#e0f2e5" stroke-width="2"/></g>
        <g class="car-part" data-part="glass"><path d="M347 247L406 200Q423 186 454 186H487V247Z" fill="url(#ID-glass)" stroke="#c1d5cb" stroke-width="1.4"/><path d="M501 186H554Q586 186 608 203L659 247H501Z" fill="url(#ID-glass)" stroke="#c1d5cb" stroke-width="1.4"/><path d="M371 241L422 197H477M519 196H554Q575 195 590 205" stroke="#b5d6d5" opacity=".35"/><path d="M488 185H501V249H488Z" fill="#223d48"/><path d="M342 251H669" stroke="#d6e7dd" stroke-width="2"/><path d="M429 189L383 247M566 188L520 247" stroke="#d5eee2" stroke-width="15" opacity=".06"/></g>
        <g class="car-part" data-part="door"><path d="M365 259L490 256H649L645 322Q643 333 630 333H379Q366 333 365 322Z" fill="url(#ID-paint)" stroke="#31545d" stroke-width=".9"/><path d="M491 257V331" stroke="#2d5660" stroke-width="1"/><path d="M376 268H638" stroke="#b8ddd3" stroke-width="1.4"/><rect x="453" y="272" width="24" height="4" rx="2" fill="#cce2d8"/><rect x="606" y="272" width="23" height="4" rx="2" fill="#cce2d8"/><path d="M382 325H629" stroke="#a6cec6" opacity=".5"/></g>
        <g class="car-part wheel-part" data-part="rearWheel">${wheel(285)}</g>
        <g class="car-part wheel-part" data-part="frontWheel">${wheel(735)}</g>
        <g class="car-part" data-part="trim"><path d="M810 304L891 310L897 328L814 329Z" fill="#1a3641"/><path d="M820 311H889M817 317H892M817 323H892" stroke="#6f979d" stroke-width="1.3"/><path d="M134 309L198 309L202 324H134" fill="#233e46"/><path d="M138 316H194" stroke="#729b9c"/><path d="M656 241L682 238Q691 238 692 246L675 253L658 250Z" fill="url(#ID-paint)" stroke="#31545d"/><path d="M150 340H205M818 339H894" stroke="#d2e4d6" stroke-width="3"/><path d="M837 277L875 285L884 295L829 291Z" fill="#d9f8ee" stroke="#688f96"/><path d="M146 285L175 281L169 292H141Z" fill="#b15e4f"/><path d="M837 281L875 288" stroke="white" stroke-width="2"/><path d="M169 330H193M862 333H883" stroke="#17313c" stroke-width="4"/></g>
        <g class="finish-sweep" clip-path="url(#ID-silhouette)"><path d="M0 145H85L0 370H-85Z" fill="url(#ID-sweep)"/></g>
        <g class="headlight-glow"><ellipse cx="880" cy="291" rx="110" ry="44" fill="url(#ID-glow)"/><path d="M839 281L876 288" stroke="#f1ffff" stroke-width="3"/></g>
      </g>
      <g class="assembly-labels" fill="currentColor" font-family="monospace" font-size="9" letter-spacing="1.8"><text x="117" y="199">01 / BODY</text><text x="778" y="170">02 / POWER</text><text x="118" y="468">03 / WHEELS</text><text x="760" y="461">04 / FINISH</text></g>
      <g class="scan-line"><path d="M90 0V465" stroke="currentColor" stroke-width="1"/><path d="M88 155H92V377H88Z" fill="currentColor" opacity=".5"/></g>
    </svg>`.replaceAll('ID-', id + '-');
  }

  class CarOpening {
    constructor(host, options = {}) {
      this.host = host;
      this.variant = Object.hasOwn(variants,options.variant) ? options.variant : 'atelier';
      this.onUpdate = options.onUpdate || (() => {});
      this.onFinish = options.onFinish || (() => {});
      this.animations = [];
      this.time = 0;
      this.state = 'idle';
      this.frame = 0;
      this.nativePlayback = false;
      this.playRequest = 0;
      this.lastUiUpdate = -Infinity;
      this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      this.motionChange = () => { if (this.reducedMotion.matches && this.state !== 'idle') this.seek(this.duration); };
      this.reducedMotion.addEventListener('change', this.motionChange);
      this.host.innerHTML = `<div class="assembly-scene"><div class="scene-grid"></div><div class="scene-orbit orbit-one"></div><div class="scene-orbit orbit-two"></div><div class="scene-topline"><span>AUTO SERVICE</span><span class="scene-edition"></span></div><div class="scene-heading"><span class="scene-eyebrow"></span><h2 class="scene-title"></h2></div><div class="assembly-art">${artwork('car' + ++instance)}</div><div class="scene-bottom"><div><span class="scene-status"></span><span class="scene-count">EVERY DETAIL. ONE BEAUTIFUL DRIVE.</span></div><span class="scene-percent">000<span>%</span></span></div><div class="scene-progress"><span></span></div></div>`;
      this.scene = host.querySelector('.assembly-scene');
      this.artHost = this.scene.querySelector('.assembly-art');
      this.statusNode = this.scene.querySelector('.scene-status');
      this.percentNode = this.scene.querySelector('.scene-percent').firstChild;
      this.progressNode = this.scene.querySelector('.scene-progress span');
      this.setVariant(this.variant);
    }
    get duration() { return variants[this.variant].duration; }
    setVariant(variant) {
      this.stop();
      this.variant = Object.hasOwn(variants,variant) ? variant : 'atelier';
      const config = variants[this.variant];
      this.scene.dataset.variant = this.variant;
      this.scene.querySelector('.scene-edition').textContent = `${config.number} / ASSEMBLY STUDY`;
      this.scene.querySelector('.scene-eyebrow').textContent = config.english;
      this.scene.querySelector('.scene-title').textContent = config.line;
      const photographic = this.variant === 'blueprint' && window.BlueprintScene;
      this.scene.querySelector('.bp-environment')?.remove();
      this.artHost.classList.toggle('bp-art',!!photographic);
      if (photographic) {
        const environment = document.createElement('div');
        environment.className = 'bp-environment';
        environment.setAttribute('aria-hidden','true');
        environment.innerHTML = window.BlueprintScene.environment;
        this.scene.prepend(environment);
        this.artHost.innerHTML = window.BlueprintScene.artwork('bp' + ++instance);
      } else {
        this.artHost.innerHTML = artwork('car' + ++instance);
      }
      this.buildTimeline();
      this.seek(0);
    }
    animate(selector, frames, start, duration, options = {}) {
      const node = this.scene.querySelector(selector);
      if (!node) return;
      const animation = node.animate(frames, {duration, delay:start, fill:'both', easing:'cubic-bezier(.22,.78,.2,1)', ...options});
      animation.pause();
      animation.currentTime = 0;
      this.animations.push(animation);
    }
    buildTimeline() {
      this.animations.forEach(a => a.cancel());
      this.animations = [];
      if (this.variant === 'blueprint' && window.BlueprintScene) {
        window.BlueprintScene.timeline(this);
        return;
      }
      const blueprint = this.variant === 'blueprint';
      const orbit = this.variant === 'orbit';
      const parts = [...this.scene.querySelectorAll('.car-part')];
      const directions = {
        chassis:[0,130,0], engine:[310,-125,18], interior:[-80,-170,-10], body:[0,-150,0],
        roof:[-90,-200,-8], glass:[100,-190,8], door:[0,175,0], rearWheel:[-285,90,-110], frontWheel:[290,100,110], trim:[270,-30,15]
      };
      const starts = { chassis:450, engine:950, interior:1200, body:1800, roof:2250, glass:2650, door:3000, rearWheel:1350, frontWheel:1650, trim:3500 };
      parts.forEach((part, i) => {
        const key = part.dataset.part;
        const [x,y,r] = directions[key];
        const selector = `[data-part="${key}"]`;
        if (orbit) {
          const sign = i % 2 ? 1 : -1;
          this.animate(selector, [
            { opacity:0, transform:`translate(${x*1.5}px,${y*1.3}px) rotate(${r+sign*45}deg) scale(.68)`, offset:0 },
            { opacity:1, transform:`translate(${x*.9+sign*40}px,${y*.75}px) rotate(${r*.35}deg) scale(.9)`, offset:.42 },
            { opacity:1, transform:'translate(0,0) rotate(0deg) scale(1)', offset:1 }
          ], 200+i*135, 2300 + (i%3)*240);
        } else if (blueprint) {
          this.animate(selector, [
            {opacity:0,transform:`translate(${x*.4}px,${y*.55}px)`,filter:'brightness(1.5) saturate(0)'},
            {opacity:.65,offset:.5,filter:'brightness(1.2) saturate(.25)'},
            {opacity:1,transform:'translate(0,0)',filter:'brightness(1) saturate(1)'}
          ], 1200 + i*210, 1500);
        } else {
          this.animate(selector, [
            {opacity:0,transform:`translate(${x}px,${y}px) rotate(${r}deg)`},
            {opacity:1,offset:.24},
            {opacity:1,transform:'translate(0,0) rotate(0deg)'}
          ], starts[key], key.includes('Wheel') ? 1450 : 1150);
        }
      });
      this.animate('.car-shadow', [{opacity:0,transform:'scaleX(.5)'},{opacity:1,transform:'scaleX(1)'}], 400, 3200);
      this.animate('.car-ghost', [{opacity:0},{opacity:blueprint ? .65 : .14,offset:.2},{opacity:blueprint ? .65 : .14,offset:.65},{opacity:0}], 0, 4200);
      this.animate('.draft-lines', [{opacity:0},{opacity:blueprint ? .55 : .2,offset:.2},{opacity:blueprint ? .55 : .2,offset:.7},{opacity:0}], 0, 4800);
      this.animate('.assembly-labels', [{opacity:0},{opacity:.5,offset:.2},{opacity:.5,offset:.62},{opacity:0}], 200, 4000);
      this.animate('.scene-heading', [{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}], 150, 900);
      this.animate('.scene-topline', [{opacity:0},{opacity:1}], 0, 800);
      this.animate('.finish-sweep', [{opacity:0,transform:'translateX(150px)'},{opacity:1,offset:.12},{opacity:1,offset:.8},{opacity:0,transform:'translateX(1100px)'}], 4400, 1300, {easing:'ease-in-out'});
      this.animate('.headlight-glow', [{opacity:0},{opacity:1,offset:.5},{opacity:.7}], 4850, 900);
      this.animate('.car-motion', [{transform:'translateY(0)'},{transform:'translateY(2px)',offset:.3},{transform:'translateY(0)'}], 4300, 700);
      if (blueprint) {
        this.animate('.car-ghost', [{strokeDasharray:'3000',strokeDashoffset:'3000'},{strokeDasharray:'3000',strokeDashoffset:'0'}], 100, 2300, {easing:'ease-in-out'});
        this.animate('.scan-line', [{opacity:0,transform:'translateX(0)'},{opacity:.6,offset:.1},{opacity:.6,offset:.85},{opacity:0,transform:'translateX(860px)'}], 300, 4400, {easing:'linear'});
        this.animate('.scene-grid', [{opacity:.6},{opacity:.6,offset:.6},{opacity:.12}], 0, 5500);
      } else {
        this.animate('.scan-line', [{opacity:0},{opacity:0}], 0, 1);
      }
      if (orbit) {
        this.animate('.orbit-one', [{opacity:0,transform:'translate(-50%,-50%) rotate(-35deg) scale(.8)'},{opacity:.7,offset:.25},{opacity:0,transform:'translate(-50%,-50%) rotate(30deg) scale(1.15)'}], 0, 4700);
        this.animate('.orbit-two', [{opacity:0,transform:'translate(-50%,-50%) rotate(30deg) scale(1.1)'},{opacity:.5,offset:.3},{opacity:0,transform:'translate(-50%,-50%) rotate(-30deg) scale(.85)'}], 100, 4700);
      }
    }
    render() {
      // During 02 playback, the document timeline drives the image layers directly.
      // Only explicit seeking/pausing writes their time from JavaScript.
      if (!this.nativePlayback || this.state !== 'playing') this.animations.forEach(a => { a.currentTime = this.time; });
      if (this.variant === 'blueprint') this.scene.dataset.playback = this.state;
      else delete this.scene.dataset.playback;
      const ratio = Math.min(1, this.time / this.duration);
      const step = ratio < .17 ? 0 : ratio < .47 ? 1 : ratio < .77 ? 2 : 3;
      const label = variants[this.variant].steps[step];
      const percent = String(Math.round(ratio*100)).padStart(3,'0');
      if (this.statusNode.textContent !== label) this.statusNode.textContent = label;
      if (this.percentNode.nodeValue !== percent) this.percentNode.nodeValue = percent;
      this.progressNode.style.transform = `scaleX(${ratio})`;
      this.onUpdate({time:this.time,duration:this.duration,progress:ratio,state:this.state});
    }
    tick(now) {
      if (this.state !== 'playing') return;
      this.time = Math.min(this.duration, now-this.startedAt);
      if (this.time >= this.duration) {
        this.animations.forEach(a => a.pause());
        this.nativePlayback = false;
        this.state = 'finished';
        this.render();
        this.onFinish();
      } else {
        if (!this.nativePlayback || now-this.lastUiUpdate >= 1000/30) {
          this.render();
          this.lastUiUpdate = now;
        }
        this.frame = requestAnimationFrame(t => this.tick(t));
      }
    }
    play(restart = true) {
      cancelAnimationFrame(this.frame);
      this.animations.forEach(a => a.pause());
      this.nativePlayback = false;
      const request = ++this.playRequest;
      if (restart || this.time >= this.duration) this.time = 0;
      if (this.reducedMotion.matches) {
        this.state = 'finished'; this.time = this.duration; this.render(); this.onFinish(); return;
      }
      const photographic = this.variant === 'blueprint' && window.BlueprintScene;
      const timelineTime = document.timeline?.currentTime;
      if (photographic && typeof timelineTime === 'number' && window.BlueprintScene.prepare && !window.BlueprintScene.isReady) {
        this.state = 'loading';
        this.render();
        window.BlueprintScene.prepare().then(() => {
          if (this.playRequest === request && this.state === 'loading') this.play(false);
        });
        return;
      }
      this.nativePlayback = !!photographic && typeof timelineTime === 'number';
      this.animations.forEach(a => {
        a.currentTime = this.time;
        if (this.nativePlayback) {
          a.play();
          a.startTime = timelineTime-this.time;
        }
      });
      this.state = 'playing';
      this.startedAt = performance.now()-this.time;
      this.lastUiUpdate = -Infinity;
      this.render();
      this.frame = requestAnimationFrame(t => this.tick(t));
    }
    pause() {
      cancelAnimationFrame(this.frame);
      ++this.playRequest;
      if (this.state === 'playing') this.time = Math.min(this.duration,performance.now()-this.startedAt);
      this.animations.forEach(a => a.pause());
      this.nativePlayback = false;
      this.state = 'paused';
      this.render();
    }
    seek(time) {
      cancelAnimationFrame(this.frame);
      ++this.playRequest;
      this.animations.forEach(a => a.pause());
      this.nativePlayback = false;
      this.time = Math.max(0,Math.min(this.duration,Number(time)||0));
      this.state = this.time >= this.duration ? 'finished' : 'paused';
      this.render();
    }
    stop() {
      cancelAnimationFrame(this.frame);
      ++this.playRequest;
      this.animations.forEach(a => a.pause());
      this.nativePlayback = false;
      this.state = 'idle';
      if (this.variant === 'blueprint' && this.scene) this.scene.dataset.playback = 'idle';
    }
    destroy() { this.stop(); this.animations.forEach(a => a.cancel()); this.reducedMotion.removeEventListener('change',this.motionChange); this.host.replaceChildren(); }
  }
  window.CarOpening = CarOpening;
  window.carOpeningVariants = variants;
})();
