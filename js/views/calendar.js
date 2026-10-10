// "My schedule": a 24-hour day view, a week view, and a month view.
// Shows habits (with times), alarms and one-off events together.
import { isDue, isDone, toggleHabit, dayScore } from '../store.js';
import { buildIcs } from '../ics.js';
import { openSheet, field } from './sheet.js';
import { downloadFile } from './files.js';
import { ymd, addDays, parseYmd, weekday, esc, fmtTime, DAY_NAMES, MONTH_NAMES, uid } from '../util.js';

let mode = 'day';
let cursor = ymd();

/** Everything scheduled on a date, sorted by time. */
export function itemsOn(state, date) {
  const out = [];
  for (const h of state.habits) {
    if (!isDue(h, date) || (h.createdAt && date < h.createdAt)) continue;
    out.push({ kind: 'habit', id: h.id, time: h.time || '', title: `${h.emoji} ${h.name}`, done: isDone(state, h.id, date), area: h.area });
  }
  for (const a of state.alarms) {
    if (!a.enabled || (a.days?.length && !a.days.includes(weekday(date)))) continue;
    out.push({ kind: 'alarm', id: a.id, time: a.time, title: `⏰ ${a.label}`, important: a.important });
  }
  for (const e of state.events) if (e.date === date) out.push({ kind: 'event', id: e.id, time: e.time || '', title: `📅 ${e.title}`, minutes: e.minutes });
  for (const s of state.skills) if (s.learnedAt === date) out.push({ kind: 'skill', id: s.id, time: '', title: `🎉 Learned: ${s.name}` });
  return out.sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
}

const chipFor = (it, date) =>
  `<span class="ev ${it.kind}${it.done ? ' done' : ''}${it.important ? ' important' : ''}" ${it.kind === 'habit' ? `data-toggle="${it.id}" data-date="${date}" role="button"` : it.kind === 'event' ? `data-event="${it.id}" role="button"` : ''}>${it.time ? `<small>${fmtTime(it.time)}</small> ` : ''}${esc(it.title)}${it.kind === 'habit' ? (it.done ? ' ✓' : '') : ''}</span>`;

function dayView(state) {
  const items = itemsOn(state, cursor);
  const untimed = items.filter((i) => !i.time);
  const nowH = cursor === ymd() ? new Date().getHours() : -1;
  let rows = '';
  for (let h = 0; h < 24; h++) {
    const at = items.filter((i) => i.time && Number(i.time.slice(0, 2)) === h);
    rows += `<div class="hour${at.length ? '' : ' empty'}${h === nowH ? ' now' : ''}" data-hour="${h}"><span class="hl">${fmtTime(`${String(h).padStart(2, '0')}:00`)}</span><div>${at.map((i) => chipFor(i, cursor)).join('')}</div></div>`;
  }
  return `
    ${untimed.length ? `<div class="anytime"><h4 class="cat">Any time today</h4>${untimed.map((i) => chipFor(i, cursor)).join('')}</div>` : ''}
    <div class="timeline">${rows}</div>
    <p class="muted small">Tap an empty hour to plan something. Tap a habit to tick it off.</p>`;
}

function weekView(state) {
  const start = addDays(cursor, -weekday(cursor));
  const days = [...Array(7)].map((_, i) => addDays(start, i));
  const today = ymd();
  return `<div class="week">${days
    .map((d) => {
      const items = itemsOn(state, d);
      return `<div class="wcol${d === today ? ' today' : ''}"><button class="wday" data-day="${d}"><b>${DAY_NAMES[weekday(d)]}</b> ${parseYmd(d).getDate()}</button>${items.map((i) => chipFor(i, d)).join('') || '<small class="muted">—</small>'}</div>`;
    })
    .join('')}</div>`;
}

function monthView(state) {
  const d0 = parseYmd(cursor);
  const first = ymd(new Date(d0.getFullYear(), d0.getMonth(), 1));
  const start = addDays(first, -weekday(first));
  const today = ymd();
  let cells = DAY_NAMES.map((n) => `<b class="dow">${n[0]}</b>`).join('');
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i);
    const inMonth = parseYmd(d).getMonth() === d0.getMonth();
    const score = d <= today ? dayScore(state, d) : null;
    const items = itemsOn(state, d);
    const marks = [items.some((x) => x.kind === 'event') && '<i class="m-event"></i>', items.some((x) => x.kind === 'skill') && '<i class="m-skill"></i>', items.some((x) => x.important) && '<i class="m-alarm"></i>'].filter(Boolean).join('');
    cells += `<button class="mcell${inMonth ? '' : ' out'}${d === today ? ' today' : ''}" data-day="${d}" style="${score != null ? `--s:${score}` : ''}"><span>${parseYmd(d).getDate()}</span><span class="marks">${marks}</span></button>`;
  }
  return `<div class="month">${cells}</div><p class="muted small legend"><i class="m-event"></i> plans <i class="m-skill"></i> skill learned <i class="m-alarm"></i> important alarm · color = share of habits done</p>`;
}

export function render({ state }) {
  const d = parseYmd(cursor);
  const title = mode === 'month' ? `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}` : mode === 'week' ? `Week of ${addDays(cursor, -weekday(cursor)).slice(5).replace('-', '/')}` : d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  return `
    <section>
      <div class="title-row"><h1>My schedule</h1><button class="btn primary" data-new>+ Plan</button></div>
      <div class="chips seg">${['day', 'week', 'month'].map((m) => `<button class="chip${mode === m ? ' on' : ''}" data-mode="${m}">${m === 'day' ? '24 hours' : m[0].toUpperCase() + m.slice(1)}</button>`).join('')}</div>
      <div class="nav-row"><button class="icon-btn" data-move="-1" aria-label="Previous">‹</button><b>${title}</b><button class="icon-btn" data-move="1" aria-label="Next">›</button></div>
      ${cursor !== ymd() ? '<button class="btn small" data-today>Back to today</button>' : ''}
      ${mode === 'day' ? dayView(state) : mode === 'week' ? weekView(state) : monthView(state)}
      <div class="card">
        <b>Put this schedule in your phone's calendar</b>
        <p class="small muted">Adds every timed habit, alarm and plan, repeating weekly, with reminders that work even when this app is closed.</p>
        <button class="btn" data-ics>Export to calendar (.ics)</button>
      </div>
    </section>`;
}

function editEvent(app, e, date, hour) {
  const isNew = !e;
  e ||= { id: uid(), title: '', date: date || cursor, time: hour != null ? `${String(hour).padStart(2, '0')}:00` : '', minutes: 60, area: '', notes: '' };
  openSheet(
    `<h2>${isNew ? 'Plan something' : 'Edit plan'}</h2>
     ${field('What', `<input class="input" name="title" required value="${esc(e.title)}" placeholder="e.g. Pottery class">`)}
     <div class="row">${field('Date', `<input class="input" type="date" name="date" required value="${e.date}">`)}${field('Time', `<input class="input" type="time" name="time" value="${e.time}">`)}</div>
     ${field('Length (minutes)', `<input class="input" type="number" min="5" step="5" name="minutes" value="${e.minutes}">`)}
     ${field('Notes', `<textarea class="input" name="notes" rows="2">${esc(e.notes)}</textarea>`)}
     <div class="sheet-actions">${isNew ? '' : '<button class="btn danger" value="delete">Delete</button>'}<button class="btn" value="cancel" formnovalidate>Cancel</button><button class="btn primary" value="save">Save</button></div>`,
    (fd, action) => {
      if (action === 'delete') app.state.events = app.state.events.filter((x) => x.id !== e.id);
      else {
        Object.assign(e, { title: fd.get('title').trim(), date: fd.get('date'), time: fd.get('time'), minutes: Number(fd.get('minutes')) || 60, notes: fd.get('notes').trim() });
        if (isNew) app.state.events.push(e);
      }
      app.save();
      app.render();
    },
  );
}

export function mount(root, app) {
  root.addEventListener('click', (e) => {
    const t = e.target;
    const tog = t.closest('[data-toggle]');
    if (tog) {
      toggleHabit(app.state, tog.dataset.toggle, tog.dataset.date);
      app.save();
      return app.render();
    }
    const ev = t.closest('[data-event]');
    if (ev) return editEvent(app, app.state.events.find((x) => x.id === ev.dataset.event));
    if (t.closest('[data-mode]')) return (mode = t.closest('[data-mode]').dataset.mode), app.render();
    if (t.closest('[data-today]')) return (cursor = ymd()), app.render();
    const mv = t.closest('[data-move]');
    if (mv) {
      const n = Number(mv.dataset.move);
      if (mode === 'day') cursor = addDays(cursor, n);
      else if (mode === 'week') cursor = addDays(cursor, 7 * n);
      else {
        const d = parseYmd(cursor);
        cursor = ymd(new Date(d.getFullYear(), d.getMonth() + n, 1));
      }
      return app.render();
    }
    const day = t.closest('[data-day]');
    if (day) return (cursor = day.dataset.day), (mode = 'day'), app.render();
    const hour = t.closest('.hour.empty');
    if (hour) return editEvent(app, null, cursor, Number(hour.dataset.hour));
    if (t.closest('[data-new]')) return editEvent(app, null, cursor);
    if (t.closest('[data-ics]')) {
      downloadFile('just-do-it-schedule.ics', buildIcs(app.state), 'text/calendar');
      app.toast('Open the file to add it to your calendar');
    }
  });
}
