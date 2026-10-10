import { streak, bestStreak, isDue, isDone, toggleHabit } from '../store.js';
import { openSheet, daysPicker, readDays, field } from './sheet.js';
import { ymd, addDays, esc, fmtTime, daysLabel, uid } from '../util.js';
import { DOMAINS, DOMAIN_NAMES, domainOrder } from '../data.js';
import { domainEmoji } from './today.js';



function heatmap(state, h, today) {
  // 12 weeks, oldest first, one column per week.
  let cells = '';
  for (let i = 83; i >= 0; i--) {
    const d = addDays(today, -i);
    const due = isDue(h, d) && (!h.createdAt || d >= h.createdAt);
    const done = isDone(state, h.id, d);
    cells += `<i class="${done ? 'done' : due ? 'due' : ''}" title="${d}"></i>`;
  }
  return `<div class="heat" aria-hidden="true">${cells}</div>`;
}

export function render({ state }) {
  const today = ymd();
  const byArea = {};
  for (const h of [...state.habits].sort((x, y) => (x.sub || '').localeCompare(y.sub || ''))) (byArea[h.area || 'Other'] ||= []).push(h);
  const ordered = Object.entries(byArea).sort(([x], [y]) => domainOrder(x) - domainOrder(y));
  return `
    <section>
      <div class="title-row"><h1>Habits</h1><button class="btn primary" data-new>+ New</button></div>
      <p class="muted">Tap a habit to edit it. The grid shows the last 12 weeks.</p>
      ${
        state.habits.length
          ? ordered
              .map(([area, list]) => `
          <h4 class="cat">${domainEmoji(area)} ${esc(area)}</h4>
          <ul class="list">${list
            .map((h) => {
              const done = isDone(state, h.id, today);
              return `
            <li class="item habit-card" data-edit="${h.id}">
              <div class="hc-top">
                <span class="h-emoji">${esc(h.emoji)}</span>
                <span class="h-main"><b>${esc(h.name)}</b><small>${h.sub ? esc(h.sub) + ' · ' : ''}${daysLabel(h.days)}${h.time ? ' · ' + fmtTime(h.time) : ''}</small></span>
                <span class="streak">🔥${streak(state, h, today)} <small>best ${bestStreak(state, h, today)}</small></span>
                ${isDue(h, today) ? `<button class="check${done ? ' on' : ''}" data-toggle="${h.id}" aria-label="Done today">${done ? '✓' : ''}</button>` : ''}
              </div>
              ${heatmap(state, h, today)}
            </li>`;
            })
            .join('')}</ul>`)
              .join('')
          : `<p class="empty">No habits yet. <a href="#quiz">Answer the questions</a> and we will build them for you, or add your own.</p>`
      }
    </section>`;
}

function edit(app, h) {
  const isNew = !h;
  h ||= { id: uid(), name: '', emoji: '✅', area: 'Body', sub: '', days: [], time: '', notes: '', createdAt: ymd() };
  const allAreas = DOMAINS.flatMap((d) => d.areas);
  openSheet(
    `<h2>${isNew ? 'New habit' : 'Edit habit'}</h2>
     <div class="row">${field('Emoji', `<input class="input emoji-in" name="emoji" value="${esc(h.emoji)}" maxlength="4">`)}${field('Name', `<input class="input" name="name" required value="${esc(h.name)}" placeholder="e.g. Drink 2 L of water">`)}</div>
     <div class="row">${field('Life area', `<select class="input" name="area">${DOMAIN_NAMES.map((a) => `<option${a === h.area ? ' selected' : ''}>${a}</option>`).join('')}</select>`)}${field('Part', `<input class="input" name="sub" list="subs" value="${esc(h.sub || '')}" placeholder="e.g. Sleep"><datalist id="subs">${allAreas.map((x) => `<option value="${esc(x)}">`).join('')}</datalist>`)}</div>
     <div class="field"><span>Days</span>${daysPicker(h.days)}</div>
     ${field('Time (optional)', `<input class="input" type="time" name="time" value="${esc(h.time)}">`)}
     ${field('Notes', `<textarea class="input" name="notes" rows="2">${esc(h.notes)}</textarea>`)}
     <div class="sheet-actions">
       ${isNew ? '' : '<button class="btn danger" value="delete">Delete</button>'}
       <button class="btn" value="cancel" formnovalidate>Cancel</button>
       <button class="btn primary" value="save">Save</button>
     </div>`,
    (fd, action, form) => {
      if (action === 'delete') {
        if (!confirm(`Delete “${h.name}” and its history?`)) return false;
        app.state.habits = app.state.habits.filter((x) => x.id !== h.id);
      } else {
        Object.assign(h, { name: fd.get('name').trim(), emoji: fd.get('emoji').trim() || '✅', area: fd.get('area'), sub: fd.get('sub').trim(), time: fd.get('time'), notes: fd.get('notes').trim(), days: readDays(form) });
        if (!h.days.length) return alert('Pick at least one day'), false;
        if (isNew) app.state.habits.push(h);
      }
      app.save();
      app.render();
    },
  );
}

export function mount(root, app) {
  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toggle]');
    if (t) {
      e.stopPropagation();
      toggleHabit(app.state, t.dataset.toggle, ymd());
      app.save();
      return app.render();
    }
    if (e.target.closest('[data-new]')) return edit(app);
    const ed = e.target.closest('[data-edit]');
    if (ed) edit(app, app.state.habits.find((h) => h.id === ed.dataset.edit));
  });
}
