// The "design your life" questionnaire. One section per screen; answers save as you go.
import { SECTIONS, AESTHETICS, SKILL_LIBRARY, SKILL_CATEGORY_EMOJI } from '../data.js';
import { buildPlan } from '../plan.js';
import { esc, DAY_NAMES, $ } from '../util.js';

const idx = () => Math.min(SECTIONS.length, Math.max(0, parseInt(location.hash.split('/')[1], 10) || 0));

function chip(label, on, attrs) {
  return `<button type="button" class="chip${on ? ' on' : ''}" aria-pressed="${on}" ${attrs}>${esc(label)}</button>`;
}

function question(q, a) {
  const v = a[q.id];
  switch (q.type) {
    case 'aesthetic':
      return `<div class="aesthetics">${Object.entries(AESTHETICS)
        .map(([id, x]) => `
          <button type="button" class="aes${v === id ? ' on' : ''}" data-q="${q.id}" data-single="${id}" aria-pressed="${v === id}" style="--a:${x.accent};--b:${x.bg};--i:${x.ink}">
            <span class="aes-swatch"><i></i><i></i><i></i></span>
            <b>${x.emoji} ${esc(x.name)}</b><small>${esc(x.words)}</small>
          </button>`)
        .join('')}</div>`;
    case 'single':
      return `<div class="chips">${q.options.map((o) => chip(o, v === o, `data-q="${q.id}" data-single="${esc(o)}"`)).join('')}</div>`;
    case 'multi':
      return `<div class="chips">${q.options.map((o) => chip(o, (v || []).includes(o), `data-q="${q.id}" data-multi="${esc(o)}"`)).join('')}</div>`;
    case 'days':
      return `<div class="days">${DAY_NAMES.map((d, i) => chip(d, (v || []).includes(i), `data-q="${q.id}" data-day="${i}"`)).join('')}</div>`;
    case 'time':
      return `<input type="time" class="input" data-q="${q.id}" data-input value="${esc(v || q.default || '')}">`;
    case 'text':
      return `<textarea class="input" rows="3" data-q="${q.id}" data-input placeholder="${esc(q.placeholder || '')}">${esc(v || '')}</textarea>`;
    case 'skills': {
      const picks = v || [];
      const areas = a.skillAreas?.length ? a.skillAreas : Object.keys(SKILL_LIBRARY);
      const custom = picks.filter((p) => !Object.values(SKILL_LIBRARY).flat().includes(p));
      return `
        <p class="count-line"><b id="pick-count">${picks.length}</b> / 100 picked · body goals from earlier are added too</p>
        ${areas
          .map((cat) => `
            <h4 class="cat">${SKILL_CATEGORY_EMOJI[cat] || ''} ${esc(cat)}</h4>
            <div class="chips">${SKILL_LIBRARY[cat].map((s) => chip(s, picks.includes(s), `data-q="skillPicks" data-multi="${esc(s)}"`)).join('')}</div>`)
          .join('')}
        <h4 class="cat">⭐ Your own</h4>
        <div class="chips">${custom.map((s) => chip(s, true, `data-q="skillPicks" data-multi="${esc(s)}"`)).join('')}</div>
        <form class="row" id="custom-skill"><input class="input" name="s" placeholder="Add any skill…" autocomplete="off"><button class="btn">Add</button></form>`;
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
      <h1>${s.emoji} ${esc(s.title)}</h1>
      ${s.intro ? `<p class="lead">${esc(s.intro)}</p>` : ''}
      ${s.questions.map((q) => `<div class="q"><h3>${esc(q.q)}</h3>${question(q, a)}</div>`).join('')}
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
      a[q] = b.dataset.single;
      root.querySelectorAll(`[data-q="${q}"][data-single]`).forEach((x) => {
        x.classList.toggle('on', x === b);
        x.setAttribute('aria-pressed', x === b);
      });
      if (q === 'aesthetic') app.applyTheme();
    } else if (b.dataset.multi !== undefined || b.dataset.day !== undefined) {
      const val = b.dataset.multi ?? Number(b.dataset.day);
      const list = (a[q] ||= []);
      const k = list.indexOf(val);
      if (k >= 0) list.splice(k, 1);
      else list.push(val);
      b.classList.toggle('on', k < 0);
      b.setAttribute('aria-pressed', k < 0);
      if (q === 'skillPicks') $('#pick-count').textContent = list.length;
    }
    app.save();
  });
  root.addEventListener('input', (e) => {
    const el = e.target.closest('[data-input]');
    if (!el) return;
    a[el.dataset.q] = el.value;
    app.save();
  });
  root.querySelector('#custom-skill')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.s.value.trim();
    if (!name) return;
    (a.skillPicks ||= []).includes(name) || a.skillPicks.push(name);
    app.save();
    app.render();
  });
}
