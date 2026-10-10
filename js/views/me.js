// "My world": a little avatar you dress up, standing in a home you design.
import { OPTIONS, SKIN, EYE_COLORS, HAIR_COLORS, CLOTH_COLORS, SCENES, ROOM_ITEMS, FLOORS, SKIES, normalizeAvatar, sceneSvg, randomize } from '../avatar.js';
import { downloadFile } from './files.js';
import { esc } from '../util.js';

let tab = 'me';

const chip = (label, on, attrs) => `<button type="button" class="chip${on ? ' on' : ''}" aria-pressed="${on}" ${attrs}>${esc(label)}</button>`;
const swatches = (key, colors, current) =>
  `<div class="swatches">${colors.map((c) => `<button type="button" class="swatch${c.toLowerCase() === String(current).toLowerCase() ? ' on' : ''}" data-set="${key}" data-val="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}<label class="swatch custom" title="Any colour"><input type="color" data-color="${key}" value="${current}"><span>＋</span></label></div>`;
const row = (title, body) => `<div class="me-row"><h3>${esc(title)}</h3>${body}</div>`;

export function render({ state }) {
  const a = (state.avatar = normalizeAvatar(state.avatar));
  const s = a.scene;
  const tabs = { me: '🙂 Me', style: '👗 Style', world: '🏡 World' };
  let panel = '';
  if (tab === 'me') {
    panel =
      row('Name', `<input class="input" data-name value="${esc(a.name)}" placeholder="Your avatar's name" maxlength="22">`) +
      row('Skin', swatches('skin', SKIN, a.skin)) +
      row('Eyes', `<div class="chips">${OPTIONS.eyes.map((o) => chip(o, a.eyes === o, `data-set="eyes" data-val="${o}"`)).join('')}</div>${swatches('eyeColor', EYE_COLORS, a.eyeColor)}`) +
      row('Mouth', `<div class="chips">${OPTIONS.mouth.map((o) => chip(o, a.mouth === o, `data-set="mouth" data-val="${o}"`)).join('')}</div>`) +
      row('Hair', `<div class="chips">${OPTIONS.hair.map((o) => chip(o, a.hair === o, `data-set="hair" data-val="${o}"`)).join('')}</div>${swatches('hairColor', HAIR_COLORS, a.hairColor)}`);
  } else if (tab === 'style') {
    panel =
      row('Top', `<div class="chips">${OPTIONS.top.map((o) => chip(o, a.top === o, `data-set="top" data-val="${o}"`)).join('')}</div>${swatches('topColor', CLOTH_COLORS, a.topColor)}`) +
      (a.top === 'dress' || a.top === 'overalls' ? '' : row('Bottom', `<div class="chips">${OPTIONS.bottom.map((o) => chip(o, a.bottom === o, `data-set="bottom" data-val="${o}"`)).join('')}</div>${swatches('bottomColor', CLOTH_COLORS, a.bottomColor)}`)) +
      row('Shoes', `<div class="chips">${OPTIONS.shoes.map((o) => chip(o, a.shoes === o, `data-set="shoes" data-val="${o}"`)).join('')}</div>${swatches('shoesColor', CLOTH_COLORS, a.shoesColor)}`) +
      row('Extras', `<div class="chips">${OPTIONS.extras.map((o) => chip(o, a.extras.includes(o), `data-extra="${o}"`)).join('')}</div>`);
  } else {
    panel =
      row('Place', `<div class="chips">${Object.keys(SCENES).map((p) => chip(p, s.preset === p, `data-scene="${esc(p)}"`)).join('')}</div>`) +
      row(s.outdoor ? 'Sky' : 'Window view', `<div class="chips">${SKIES.map((k) => chip(k, s.sky === k, `data-sky="${k}"`)).join('')}</div>`) +
      (s.outdoor ? '' : row('Walls', swatches('wall', ['#efe6d8', '#f4efe6', '#e6e0f0', '#dfeae2', '#e3edf5', '#f6e1e1', '#a8754c', '#2e3346', '#4a6b63'], s.wall))) +
      row('Floor', `<div class="chips">${FLOORS.map((k) => chip(k, s.floor === k, `data-floor="${k}"`)).join('')}</div>${swatches('floorColor', ['#b88a5c', '#8a6a4a', '#d8d2c4', '#cdbfd8', '#8cc06b', '#ecd6a6', '#5a5f6e', '#f4efe6'], s.floorColor)}`) +
      row('Things', `<div class="chips">${ROOM_ITEMS.map((k) => chip(k, s.items.includes(k), `data-item="${k}"`)).join('')}</div>`) +
      `<button class="btn" data-match>🎨 Match my look's colours</button> <button class="btn" data-outdoor>${s.outdoor ? '🏠 Go inside' : '🌳 Go outside'}</button>`;
  }
  return `
    <section class="me">
      <div class="title-row"><h1>${a.name ? esc(a.name) + '’s world' : 'My world'}</h1></div>
      <p class="lead quote">Enjoy the process of creating yourself and your world.</p>
      <div class="avatar-stage">${sceneSvg(a)}</div>
      <div class="row wrap center-row"><button class="btn" data-random>🎲 Surprise outfit</button><button class="btn" data-png>💾 Save picture</button></div>
      <div class="chips seg">${Object.entries(tabs).map(([k, v]) => `<button class="chip${tab === k ? ' on' : ''}" data-tab="${k}">${v}</button>`).join('')}</div>
      <div class="card me-panel">${panel}</div>
    </section>
    <a class="me-float" href="#me" aria-hidden="true" tabindex="-1">${sceneSvg(a, { label: false })}</a>`;
}

async function savePicture(a) {
  const svg = sceneSvg(a);
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const c = Object.assign(document.createElement('canvas'), { width: 1080, height: 1440 });
    c.getContext('2d').drawImage(img, 0, 0, 1080, 1440);
    const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
    await downloadFile(`${(a.name || 'my-world').replace(/[^\w-]+/g, '-').toLowerCase()}.png`, blob, 'image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
}

let observer = null;
export function leave() {
  observer?.disconnect();
}

export function mount(root, app) {
  const st = app.state;
  // Show the small floating avatar once the big one has scrolled out of view.
  observer?.disconnect();
  const stage = root.querySelector('.avatar-stage');
  const float = root.querySelector('.me-float');
  if (stage && float && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([en]) => float.classList.toggle('show', !en.isIntersecting), { rootMargin: '-60px 0px 0px 0px' });
    observer.observe(stage);
  }
  float?.addEventListener('click', (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: 'smooth' });
  });
  const a = st.avatar;
  const done = () => {
    app.save();
    app.render();
  };
  root.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    const d = t.dataset;
    if (d.tab) return (tab = d.tab), app.render();
    if (d.random !== undefined) return (st.avatar = randomize(a)), done();
    if (d.png !== undefined) return savePicture(a);
    if (d.set) {
      if (['wall', 'floorColor'].includes(d.set)) a.scene[d.set] = d.val;
      else a[d.set] = d.val;
      return done();
    }
    if (d.extra) {
      const i = a.extras.indexOf(d.extra);
      if (i >= 0) a.extras.splice(i, 1);
      else a.extras.push(d.extra);
      return done();
    }
    if (d.scene) return (a.scene = { preset: d.scene, ...JSON.parse(JSON.stringify(SCENES[d.scene])) }), done();
    if (d.sky) return (a.scene.sky = d.sky), done();
    if (d.floor) return (a.scene.floor = d.floor), done();
    if (d.item) {
      const i = a.scene.items.indexOf(d.item);
      if (i >= 0) a.scene.items.splice(i, 1);
      else a.scene.items.push(d.item);
      return done();
    }
    if (d.outdoor !== undefined) return (a.scene.outdoor = !a.scene.outdoor), done();
    if (d.match !== undefined) {
      const cs = getComputedStyle(document.documentElement);
      const get = (v) => cs.getPropertyValue(v).trim();
      const hex = (v) => (/^#[0-9a-f]{6}$/i.test(v) ? v : null);
      a.scene.wall = hex(get('--surface')) || a.scene.wall;
      a.scene.floorColor = hex(get('--accent2')) || a.scene.floorColor;
      a.topColor = hex(get('--accent')) || a.topColor;
      return done();
    }
  });
  root.addEventListener('change', (e) => {
    const k = e.target.dataset.color;
    if (k) {
      if (['wall', 'floorColor'].includes(k)) a.scene[k] = e.target.value;
      else a[k] = e.target.value;
      done();
    }
  });
  root.querySelector('[data-name]')?.addEventListener('change', (e) => {
    a.name = e.target.value.trim();
    done();
  });
}
