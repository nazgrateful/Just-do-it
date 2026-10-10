// The 100-skills challenge. Skills are grouped by area so related skills sit together,
// each group has its own progress, and skills can link to the ones they build on.
import { challengeStats, skillMinutes } from '../store.js';
import { SKILL_LIBRARY, SKILL_CATEGORY_EMOJI } from '../data.js';
import { makeSkill, categoryOf } from '../plan.js';
import { openSheet, field } from './sheet.js';
import { esc, fmtMinutes, fmtDate, ymd } from '../util.js';

const STATUS = { todo: 'To learn', learning: 'Learning', learned: 'Learned ✓' };
let filter = 'all';

function skillItem(state, s) {
  const mins = skillMinutes(state, s.id);
  const builds = (s.buildsOn || []).map((id) => state.skills.find((x) => x.id === id)?.name).filter(Boolean);
  return `
    <li class="item skill ${s.status}" data-edit="${s.id}">
      <button class="check${s.status === 'learned' ? ' on' : s.status === 'learning' ? ' half' : ''}" data-cycle="${s.id}" aria-label="Change status">${s.status === 'learned' ? '✓' : s.status === 'learning' ? '◐' : ''}</button>
      <span class="h-main"><b>${esc(s.name)}</b>
        <small>${STATUS[s.status]}${mins ? ' · ' + fmtMinutes(mins) : ''}${s.learnedAt ? ' · ' + fmtDate(s.learnedAt) : ''}</small>
        ${builds.length ? `<small class="muted">↳ builds on ${esc(builds.join(', '))}</small>` : ''}
      </span>
      ${s.status !== 'learned' ? `<a class="btn small" href="#timer/skill/${s.id}" data-stop>▶</a>` : ''}
    </li>`;
}

export function render({ state }) {
  const c = challengeStats(state);
  const goal = state.challenge.goal;
  const groups = {};
  for (const s of state.skills) (groups[s.category || 'Other'] ||= []).push(s);
  const order = { learning: 0, todo: 1, learned: 2 };
  const shown = (s) => filter === 'all' || s.status === filter;

  return `
    <section>
      <div class="title-row"><h1>${goal} skills</h1><button class="btn primary" data-new>+ Skill</button></div>
      <div class="card challenge">
        <div class="bar"><i style="width:${Math.min(100, (c.learned / goal) * 100)}%"></i><b style="left:${Math.min(100, (c.expected / goal) * 100)}%" title="Where you should be today"></b></div>
        <div class="stats3">
          <div><b>${c.learned}</b><small>learned</small></div>
          <div><b>${c.learning}</b><small>learning</small></div>
          <div><b>${c.planned}</b><small>on your list</small></div>
          <div><b>${c.remainingDays}</b><small>days left</small></div>
        </div>
        <p class="small ${c.ahead >= 0 ? 'good' : 'warn'}">${c.ahead > 0 ? `On track — ${c.ahead} ahead of pace.` : c.ahead === 0 ? 'On track.' : `${-c.ahead} behind pace.`} ${c.left ? `Next skill due every ${c.daysPerSkill.toFixed(1)} days.` : 'Goal reached! 🎉'}${c.planned < goal ? ` Add ${goal - c.planned} more to your list.` : ''}</p>
      </div>
      <div class="chips seg">${['all', 'learning', 'todo', 'learned'].map((f) => `<button class="chip${filter === f ? ' on' : ''}" data-filter="${f}">${f === 'all' ? 'All' : STATUS[f]}</button>`).join('')}</div>
      ${
        state.skills.length
          ? Object.entries(groups)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([cat, list]) => {
                const learned = list.filter((s) => s.status === 'learned').length;
                const items = list.filter(shown).sort((a, b) => order[a.status] - order[b.status]);
                if (!items.length) return '';
                return `
            <details class="group" open>
              <summary><span>${SKILL_CATEGORY_EMOJI[cat] || '⭐'} <b>${esc(cat)}</b></span><span class="muted small">${learned}/${list.length}</span><span class="mini-bar"><i style="width:${(learned / list.length) * 100}%"></i></span></summary>
              <ul class="list">${items.map((s) => skillItem(state, s)).join('')}</ul>
            </details>`;
              })
              .join('')
          : '<p class="empty">No skills yet.</p>'
      }
      <h2>Ideas to add</h2>
      ${Object.entries(SKILL_LIBRARY)
        .map(([cat, list]) => {
          const have = new Set(state.skills.map((s) => s.name));
          const left = list.filter((s) => !have.has(s));
          return left.length ? `<details class="group"><summary><span>${SKILL_CATEGORY_EMOJI[cat]} ${esc(cat)}</span><span class="muted small">${left.length} ideas</span></summary><div class="chips">${left.map((s) => `<button class="chip" data-add="${esc(s)}">+ ${esc(s)}</button>`).join('')}</div></details>` : '';
        })
        .join('')}
    </section>`;
}

function edit(app, s) {
  const isNew = !s;
  const state = app.state;
  s ||= makeSkill('', 'Other');
  const cats = [...new Set([...Object.keys(SKILL_LIBRARY), ...state.skills.map((x) => x.category), 'Other'])];
  const others = state.skills.filter((x) => x.id !== s.id).sort((a, b) => (a.category === s.category ? -1 : 1) - (b.category === s.category ? -1 : 1) || a.name.localeCompare(b.name));
  const mins = skillMinutes(state, s.id);
  openSheet(
    `<h2>${isNew ? 'New skill' : esc(s.name)}</h2>
     ${field('Skill', `<input class="input" name="name" required value="${esc(s.name)}">`)}
     ${field('Group', `<input class="input" name="category" list="cats" value="${esc(s.category)}"><datalist id="cats">${cats.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>`)}
     ${field('Status', `<select class="input" name="status">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}"${k === s.status ? ' selected' : ''}>${v}</option>`).join('')}</select>`)}
     ${field('I have learned it when…', `<input class="input" name="milestone" value="${esc(s.milestone)}">`)}
     ${field('Builds on (related skills)', `<select class="input" name="buildsOn" multiple size="4">${others.map((o) => `<option value="${o.id}"${(s.buildsOn || []).includes(o.id) ? ' selected' : ''}>${esc(o.category)} · ${esc(o.name)}</option>`).join('')}</select>`)}
     ${field('Resources & notes', `<textarea class="input" name="notes" rows="3" placeholder="Videos, books, teachers…">${esc(s.notes)}</textarea>`)}
     ${isNew ? '' : `<p class="muted small">Practised ${fmtMinutes(mins)} in ${state.sessions.filter((x) => x.skillId === s.id).length} sessions.</p>`}
     <div class="sheet-actions">
       ${isNew ? '' : '<button class="btn danger" value="delete">Delete</button>'}
       <button class="btn" value="cancel" formnovalidate>Cancel</button>
       <button class="btn primary" value="save">Save</button>
     </div>`,
    (fd, action) => {
      if (action === 'delete') {
        if (!confirm(`Delete “${s.name}”?`)) return false;
        state.skills = state.skills.filter((x) => x.id !== s.id);
      } else {
        const status = fd.get('status');
        Object.assign(s, {
          name: fd.get('name').trim(),
          category: fd.get('category').trim() || categoryOf(fd.get('name').trim()),
          milestone: fd.get('milestone').trim(),
          notes: fd.get('notes').trim(),
          buildsOn: fd.getAll('buildsOn'),
          learnedAt: status === 'learned' ? s.learnedAt || ymd() : null,
          status,
        });
        if (isNew) state.skills.push(s);
      }
      app.save();
      app.render();
    },
  );
}

export function mount(root, app) {
  const state = app.state;
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-stop]')) return;
    const f = e.target.closest('[data-filter]');
    if (f) return (filter = f.dataset.filter), app.render();
    const add = e.target.closest('[data-add]');
    if (add) {
      state.skills.push(makeSkill(add.dataset.add));
      app.save();
      app.toast(`Added “${add.dataset.add}”`);
      return app.render();
    }
    const cyc = e.target.closest('[data-cycle]');
    if (cyc) {
      e.preventDefault();
      const s = state.skills.find((x) => x.id === cyc.dataset.cycle);
      s.status = { todo: 'learning', learning: 'learned', learned: 'todo' }[s.status];
      s.learnedAt = s.status === 'learned' ? ymd() : null;
      if (s.status === 'learned') app.toast(`🎉 Skill learned: ${s.name}`), navigator.vibrate?.([30, 50, 30]);
      app.save();
      return app.render();
    }
    if (e.target.closest('[data-new]')) return edit(app);
    const ed = e.target.closest('[data-edit]');
    if (ed && !e.target.closest('summary')) edit(app, state.skills.find((x) => x.id === ed.dataset.edit));
  });
}
