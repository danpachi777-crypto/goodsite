(() => {
  'use strict';
  const stage = document.getElementById('preview-stage');
  const timeline = document.getElementById('timeline');
  const toggle = document.getElementById('play-toggle');
  const cards = [...document.querySelectorAll('.variant-card')];
  const params = new URLSearchParams(location.search);
  const variant = Object.hasOwn(carOpeningVariants,params.get('opening')) ? params.get('opening') : 'atelier';
  let scrubbing = false;
  let resumeAfterScrub = false;
  const engine = new CarOpening(stage, {
    variant,
    onUpdate({time,duration,progress,state}) {
      if (!scrubbing) timeline.value = String(time);
      timeline.style.setProperty('--played',`${progress*100}%`);
      timeline.setAttribute('aria-valuetext',`${(time/1000).toFixed(1)}秒 / ${(duration/1000).toFixed(1)}秒`);
      document.getElementById('timecode').textContent = `${(time/1000).toFixed(1)} / ${(duration/1000).toFixed(1)}`;
      toggle.textContent = state === 'playing' ? 'Ⅱ' : '▷';
      toggle.setAttribute('aria-label',state === 'playing' ? '一時停止' : '再生');
    }
  });
  function selectVariant(key, updateUrl = true) {
    engine.setVariant(key);
    const config = carOpeningVariants[key];
    cards.forEach(card => {
      const selected = card.dataset.variant === key;
      card.classList.toggle('selected',selected);
      card.setAttribute('aria-pressed',String(selected));
    });
    timeline.max = String(engine.duration);
    document.getElementById('preview-duration').textContent = `${(engine.duration/1000).toFixed(1)} SEC / SOUND OFF`;
    document.getElementById('try-opening').href = `./?opening=${key}`;
    stage.setAttribute('aria-label',`${config.name}：部品が集まってセダンが完成するアニメーション`);
    if (updateUrl) history.replaceState(null,'',`?opening=${key}`);
    engine.play();
  }
  cards.forEach(card => card.addEventListener('click',() => selectVariant(card.dataset.variant)));
  toggle.addEventListener('click',() => engine.state === 'playing' ? engine.pause() : engine.play(false));
  document.getElementById('restart').addEventListener('click',() => engine.play());
  timeline.addEventListener('pointerdown',() => { scrubbing = true; resumeAfterScrub = engine.state === 'playing'; engine.pause(); });
  timeline.addEventListener('input',() => engine.seek(timeline.value));
  function endScrub() {
    if (!scrubbing) return;
    scrubbing = false;
    if (resumeAfterScrub) engine.play(false);
  }
  window.addEventListener('pointerup',endScrub);
  window.addEventListener('pointercancel',endScrub);
  timeline.addEventListener('change',endScrub);
  document.addEventListener('visibilitychange',() => { if (document.hidden && engine.state === 'playing') engine.pause(); });
  const fullscreen = document.getElementById('fullscreen');
  if (!document.fullscreenEnabled) fullscreen.hidden = true;
  fullscreen.addEventListener('click',async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stage.requestFullscreen();
    } catch { fullscreen.hidden = true; }
  });
  document.addEventListener('fullscreenchange',() => fullscreen.setAttribute('aria-label',document.fullscreenElement ? '全画面を終了' : '全画面で見る'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const updateMotionNote = () => { document.getElementById('reduced-note').hidden = !reducedMotion.matches; };
  reducedMotion.addEventListener('change',updateMotionNote);
  updateMotionNote();
  selectVariant(variant,false);
})();
