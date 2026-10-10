// Settings → Looks: every aesthetic as a live preview card, plus "Make your own".
import { LOOKS, LOOK_CATEGORIES, FONTS, SHAPES, PATTERNS, lookById, lookVars } from '../looks.js';
import { openSheet, field } from './sheet.js';
import { esc } from '../util.js';

let q = '';
let cat = 'All';

const current = (state) => state.settings.look || state.answers.aesthetic || 'serene';
const aliasOf = { serene: 'tranquil-serenity', aero: 'frutiger-aero' };

/** Inline CSS variables so each card previews its own look, whatever look the app is in. */
function cardVars(look) {
  const { vars } = lookVars(look, false);
  return Object.entries(vars)
    .map(([k, v]) => `${k.replace('--', '--p-')}:${String(v).replace(/"/g, "'")}`)
    .join(';');
}

function card(look, active) {
  return `
    <button class="look-card${active ? ' on' : ''}" data-look="${look.id}" style="${esc(cardVars(look))}" aria-pressed="${active}">
      <span class="lc-box">
        <span class="lc-title">${esc(look.name)}</span>
        <span class="lc-words">${esc(look.words || '')}</span>
        <span class="lc-row"><span class="lc-btn">Button</span><span class="lc-chip">chip</span></span>
      </span>
      <span class="lc-sw"><i style="background:${look.accent}"></i><i style="background:${look.accent2}"></i><i style="background:${look.ink}"></i></span>
      ${active ? '<span class="lc-tick">✓ Using</span>' : ''}
    </button>`;
}

export function render({ state }) {
  const cur = aliasOf[current(state)] || current(state);
  const needle = q.trim().toLowerCase();
  const list = LOOKS.filter((l) => (cat === 'All' || l.category === cat) && (!needle || `${l.name} ${l.words} ${l.category}`.toLowerCase().includes(needle)));
  const custom = state.settings.customLook;
  const curName = cur === 'custom' ? custom?.name || 'My look' : lookById(cur)?.name || 'Tranquil serenity';
  const groups = cat === 'All' && !needle ? LOOK_CATEGORIES : [null];
  return `
    <section>
      <div class="title-row"><h1>Looks</h1><a class="btn small" href="#settings">Done</a></div>
      <p class="muted">${LOOKS.length} aesthetics from the Aesthetics Wiki and Pinterest. Each one changes the colours, lettering, boxes, buttons and shapes, and the bubbles on your Life map. Tap one to try it.</p>
      <p class="small">Using: <b>${esc(curName)}</b>${state.settings.look ? ' · <button class="linkish" data-reset>Back to my vibe answer</button>' : ''}</p>
      <input class="input" type="search" id="look-q" placeholder="Search looks: cottagecore, y2k, goth, coastal…" value="${esc(q)}">
      <div class="chips seg">${['All', ...LOOK_CATEGORIES].map((c) => `<button class="chip${cat === c ? ' on' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div class="look-grid">
        <button class="look-card make" data-make>
          <span class="lc-box"><span class="lc-title">＋ Make your own</span><span class="lc-words">Pick your colours, fonts, shapes and pattern${custom ? ` · edit “${esc(custom.name)}”` : ''}</span></span>
        </button>
        ${custom ? card({ ...custom, id: 'custom' }, cur === 'custom') : ''}
      </div>
      ${groups
        .map((g) => {
          const items = g ? list.filter((l) => l.category === g) : list;
          if (!items.length) return '';
          return `${g ? `<h2>${esc(g)}</h2>` : ''}<div class="look-grid">${items.map((l) => card(l, l.id === cur)).join('')}</div>`;
        })
        .join('') || '<p class="empty">No looks match. Try another word, or make your own.</p>'}
      <p class="small muted">Can't find yours? The Aesthetics Wiki lists over a thousand, so tap <b>Make your own</b> and build it.</p>
    </section>`;
}

function builder(app) {
  const st = app.state;
  const base = st.settings.customLook || lookById(aliasOf[current(st)] || current(st)) || lookById('tranquil-serenity');
  const opt = (obj, sel) => Object.entries(obj).map(([k, v]) => `<option value="${k}"${k === sel ? ' selected' : ''}>${esc(v.label || v)}</option>`).join('');
  const color = (name, label, v) => `<label class="color-field"><input type="color" name="${name}" value="${v}"><span>${label}</span></label>`;
  openSheet(
    `<h2>Make your own look</h2>
     ${field('Name', `<input class="input" name="name" value="${esc(base.id === 'custom' ? base.name : `My ${base.name}`)}">`)}
     <div class="colors">${color('bg', 'Background', base.bg)}${color('surface', 'Boxes', base.surface)}${color('ink', 'Text', base.ink)}${color('accent', 'Accent', base.accent)}${color('accent2', 'Second accent', base.accent2)}</div>
     <div class="row">${field('Heading font', `<select class="input" name="head">${opt(FONTS, base.head)}</select>`)}${field('Text font', `<select class="input" name="body">${opt(FONTS, base.body)}</select>`)}</div>
     <div class="row">${field('Shapes', `<select class="input" name="shape">${opt(SHAPES, base.shape)}</select>`)}${field('Pattern', `<select class="input" name="pattern">${PATTERNS.map((p) => `<option${p === base.pattern ? ' selected' : ''}>${p}</option>`).join('')}</select>`)}</div>
     <p class="small muted">Text colours are adjusted automatically if they would be hard to read.</p>
     <div class="sheet-actions"><button class="btn" value="cancel" formnovalidate>Cancel</button><button class="btn primary" value="save">Use this look</button></div>`,
    (fd) => {
      st.settings.customLook = {
        name: String(fd.get('name') || 'My look').trim() || 'My look',
        emoji: '✨', category: 'Mine', words: 'my own look',
        bg: fd.get('bg'), surface: fd.get('surface'), ink: fd.get('ink'), accent: fd.get('accent'), accent2: fd.get('accent2'),
        head: fd.get('head'), body: fd.get('body'), shape: fd.get('shape'), pattern: fd.get('pattern'),
      };
      st.settings.look = 'custom';
      app.save();
      app.applyTheme();
      app.render();
    },
  );
}

export function mount(root, app) {
  root.addEventListener('click', (e) => {
    const t = e.target;
    const c = t.closest('[data-cat]');
    if (c) return (cat = c.dataset.cat), app.render();
    if (t.closest('[data-make]')) return builder(app);
    if (t.closest('[data-reset]')) {
      delete app.state.settings.look;
      app.save();
      app.applyTheme();
      return app.render();
    }
    const l = t.closest('[data-look]');
    if (l) {
      const id = l.dataset.look;
      app.state.settings.look = id === 'tranquil-serenity' ? 'serene' : id === 'frutiger-aero' ? 'aero' : id;
      app.save();
      app.applyTheme();
      app.toast(`Look: ${id === 'custom' ? app.state.settings.customLook.name : lookById(id).name}`);
      app.render();
    }
  });
  const input = root.querySelector('#look-q');
  input?.addEventListener('input', () => {
    q = input.value;
    const pos = input.selectionStart;
    app.render();
    const el = document.querySelector('#look-q');
    el?.focus();
    el?.setSelectionRange(pos, pos);
  });
}
