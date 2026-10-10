// The "design your life" questionnaire. One section per screen; answers save as you go.
import { SECTIONS, AESTHETICS, SKILL_LIBRARY, SKILL_CATEGORY_EMOJI } from '../data.js';
import { buildPlan } from '../plan.js';
import { esc, DAY_NAMES } from '../util.js';

const idx = () => Math.min(SECTIONS.length, Math.max(0, parseInt(location.hash.split('/')[1], 10) || 0));

// Which suggestion panels are open, so they stay open when the screen redraws.
const openPanels = new Set();
let refocus = null;

function chip(label, on, attrs) {
  return `<button type="button" class="chip${on ? ' on' : ''}" aria-pressed="${on}" ${attrs}>${esc(label)}</button>`;
}

/** Collapsed "💡 Suggestions" panel. Your own answer always comes first. */
function suggestions(id, count, body, label = 'Show suggestions') {
  return `<details class="suggest" data-panel="${id}"${openPanels.has(id) ? ' open' : ''}>
    <summary>💡 ${label} <small class="muted">${count}</small></summary>
    <div class="suggest-body">${body}</div>
  </details>`;
}

/** Your answers as removable chips + a box to type your own. */
function ownList(q, list, placeholder) {
  return `
    <div class="chips mine">${list.length ? list.map((o) => `<button type="button" class="chip on" data-q="${q}" data-remove="${esc(o)}" aria-label="Remove ${esc(o)}">${esc(o)} <span aria-hidden="true">×</span></button>`).join('') : '<span class="muted small">Nothing yet — type your own below.</span>'}</div>
    <form class="add-own" data-q="${q}"><input class="input" name="v" placeholder="${esc(placeholder)}" autocomplete="off" enterkeyhint="done"><button class="btn">Add</button></form>`;
}

function question(q, a) {
  const v = a[q.id];
  switch (q.type) {
    case 'aesthetic': {
      const cards = `<div class="aesthetics">${Object.entries(AESTHETICS)
        .map(([id, x]) => `
          <button type="button" class="aes${v === id ? ' on' : ''}" data-q="${q.id}" data-single="${id}" aria-pressed="${v === id}" style="--a:${x.accent};--b:${x.bg};--i:${x.ink}">
            <span class="aes-swatch"><i></i><i></i><i></i></span>
            <b>${x.emoji} ${esc(x.name)}</b><small>${esc(x.words)}</small>
          </button>`)
        .join('')}</div>
        <p class="small muted">Picking one also sets the app's colours. Tap it again to go back to the default Frutiger Aero look.</p>`;
      return `
        <textarea class="input" rows="2" data-q="vibeText" data-input placeholder="Describe it in your own words — colours, places, textures, feelings…">${esc(a.vibeText || '')}</textarea>
        ${v && AESTHETICS[v] ? `<p class="small">Theme: <b>${AESTHETICS[v].emoji} ${esc(AESTHETICS[v].name)}</b></p>` : ''}
        ${suggestions(q.id, Object.keys(AESTHETICS).length + ' looks', cards, 'Show aesthetic ideas')}`;
    }
    case 'single':
      return `
        <input class="input" data-q="${q.id}" data-input value="${esc(v || '')}" placeholder="Type your answer…" autocomplete="off">
        ${suggestions(q.id, q.options.length, `<div class="chips">${q.options.map((o) => chip(o, v === o, `data-q="${q.id}" data-single="${esc(o)}"`)).join('')}</div>`)}`;
    case 'multi': {
      const list = v || [];
      return `
        ${ownList(q.id, list, 'Type your own and tap Add…')}
        ${suggestions(q.id, q.options.length, `<div class="chips">${q.options.map((o) => chip(o, list.includes(o), `data-q="${q.id}" data-multi="${esc(o)}"`)).join('')}</div>`)}`;
    }
    case 'days':
      return `<div class="days">${DAY_NAMES.map((d, i) => chip(d, (v || []).includes(i), `data-q="${q.id}" data-day="${i}"`)).join('')}</div>`;
    case 'time':
      return `<input type="time" class="input" data-q="${q.id}" data-input value="${esc(v || q.default || '')}">`;
    case 'text':
      return `<textarea class="input" rows="3" data-q="${q.id}" data-input placeholder="${esc(q.placeholder || '')}">${esc(v || '')}</textarea>`;
    case 'skills': {
      const picks = v || [];
      const areas = a.skillAreas?.filter((x) => SKILL_LIBRARY[x]).length ? a.skillAreas.filter((x) => SKILL_LIBRARY[x]) : Object.keys(SKILL_LIBRARY);
      const ideas = areas
        .map((cat) => `
          <h4 class="cat">${SKILL_CATEGORY_EMOJI[cat] || ''} ${esc(cat)}</h4>
          <div class="chips">${SKILL_LIBRARY[cat].map((s) => chip(s, picks.includes(s), `data-q="skillPicks" data-multi="${esc(s)}"`)).join('')}</div>`)
        .join('');
      return `
        <p class="count-line"><b id="pick-count">${picks.length}</b> / 100 skills · body goals from earlier are added too</p>
        ${ownList('skillPicks', picks, 'Type a skill you want to learn…')}
        ${suggestions('skillPicks', Object.values(SKILL_LIBRARY).flat().length + ' ideas', ideas, 'Show skill ideas')}`;
    }
  }
  return '';
}

export function render({ state }) {
  const i = idx();
  const a = state.answers;
  if (i >= SECTIONS.length) {
    return `
      <section class="quiz done">
        <div class="hero-emoji">🎉</div>
        <h1>Your plan is ready to build</h1>
        <p>We will turn your answers into habits, a cleaning schedule, workouts, a skill list and alarms. You can edit everything afterwards.</p>
        <button class="btn big primary" id="build">Build my plan</button>
        <button class="btn" data-goto="${SECTIONS.length - 1}">Back</button>
      </section>`;
  }
  const s = SECTIONS[i];
  for (const q of s.questions) if (a[q.id] === undefined && q.default !== undefined) a[q.id] = Array.isArray(q.default) ? [...q.default] : q.default;
  return `
    <section class="quiz">
      <div class="progress"><i style="width:${(i / SECTIONS.length) * 100}%"></i></div>
      <p class="muted small">Step ${i + 1} of ${SECTIONS.length}${state.onboarded ? ' · <a href="#vision">Exit</a>' : ''}</p>
      <nav class="steps-nav" aria-label="Life areas">${SECTIONS.map((x, k) => `<a href="#quiz/${k}" class="${k === i ? 'on' : ''}" title="${esc(x.title)}">${x.emoji}</a>`).join('')}</nav>
      <h1>${s.emoji} ${esc(s.title)}</h1>
      ${s.intro ? `<p class="lead">${esc(s.intro)}</p>` : ''}
      ${i === 0 ? '<p class="hint">✍️ Answer in your own words first. If you want ideas, open <b>💡 Show suggestions</b> under any question.</p>' : ''}
      ${s.questions
        .map((q, k) => {
          const head = q.area && q.area !== s.questions[k - 1]?.area ? `<h2 class="area-h">${esc(q.area)}</h2>` : '';
          return `${head}<div class="q"><h3>${esc(q.q)}</h3>${question(q, a)}</div>`;
        })
        .join('')}
      <div class="quiz-nav">
        ${i > 0 ? `<button class="btn" data-goto="${i - 1}">Back</button>` : '<span></span>'}
        <button class="btn primary" data-goto="${i + 1}">${i === SECTIONS.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </section>`;
}

function mergeById(list, add, key) {
  const have = new Set(list.map((x) => key(x).toLowerCase()));
  let n = 0;
  for (const x of add) if (!have.has(key(x).toLowerCase())) list.push(x), n++;
  return n;
}

export function mount(root, app) {
  const { state } = app;
  const a = state.answers;
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const q = b.dataset.q;
    if (b.dataset.goto !== undefined) {
      app.save();
      location.hash = `quiz/${b.dataset.goto}`;
      scrollTo(0, 0);
      return;
    }
    if (b.id === 'build') {
      const plan = buildPlan(a);
      const added = [
        mergeById(state.habits, plan.habits, (h) => h.name),
        mergeById(state.skills, plan.skills, (s) => s.name),
        mergeById(state.alarms, plan.alarms, (x) => x.label + x.time),
        mergeById(state.events, plan.events, (x) => x.title + x.date),
        mergeById(state.people, plan.people, (x) => x.relation),
      ];
      const first = !state.onboarded;
      state.onboarded = true;
      app.save();
      app.applyTheme();
      app.toast(`Added ${added[0]} habits, ${added[1]} skills, ${added[2]} alarms`);
      app.go(first ? 'vision' : 'today');
      return;
    }
    if (!q) return;
    if (b.dataset.single !== undefined) {
      // Tapping the chosen suggestion again clears it.
      a[q] = a[q] === b.dataset.single ? '' : b.dataset.single;
      if (q === 'aesthetic') {
        app.save();
        app.applyTheme();
        return app.render();
      }
      root.querySelectorAll(`[data-q="${q}"][data-single]`).forEach((x) => {
        x.classList.toggle('on', x.dataset.single === a[q]);
        x.setAttribute('aria-pressed', x.dataset.single === a[q]);
      });
      const input = root.querySelector(`input[data-q="${q}"][data-input]`);
      if (input) input.value = a[q];
    } else if (b.dataset.remove !== undefined) {
      a[q] = (a[q] || []).filter((x) => x !== b.dataset.remove);
      app.save();
      return app.render();
    } else if (b.dataset.multi !== undefined) {
      const list = (a[q] ||= []);
      const k = list.indexOf(b.dataset.multi);
      if (k >= 0) list.splice(k, 1);
      else list.push(b.dataset.multi);
      app.save();
      return app.render();
    } else if (b.dataset.day !== undefined) {
      const val = Number(b.dataset.day);
      const list = (a[q] ||= []);
      const k = list.indexOf(val);
      if (k >= 0) list.splice(k, 1);
      else list.push(val);
      b.classList.toggle('on', k < 0);
      b.setAttribute('aria-pressed', k < 0);
    }
    app.save();
  });
  root.addEventListener('toggle', (e) => {
    const id = e.target.dataset?.panel;
    if (id) e.target.open ? openPanels.add(id) : openPanels.delete(id);
  }, true);
  root.addEventListener('submit', (e) => {
    const f = e.target.closest('.add-own');
    if (!f) return;
    e.preventDefault();
    const q = f.dataset.q;
    // "a, b, c" adds three answers at once.
    const vals = f.v.value.split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
    if (!vals.length) return;
    const list = (a[q] ||= []);
    for (const x of vals) if (!list.some((y) => y.toLowerCase() === x.toLowerCase())) list.push(x);
    app.save();
    refocus = q;
    app.render();
  });
  root.addEventListener('input', (e) => {
    const el = e.target.closest('[data-input]');
    if (!el) return;
    a[el.dataset.q] = el.value;
    app.save();
  });
  if (refocus) {
    root.querySelector(`.add-own[data-q="${refocus}"] input`)?.focus({ preventScroll: true });
    refocus = null;
  }
}
