import { isDue, isDone, toggleHabit, streak, challengeStats, skillMinutes } from '../store.js';
import { nextOccurrence } from '../alarmcore.js';
import { AESTHETICS } from '../data.js';
import { hasContent } from '../store.js';
import { ymd, esc, fmtTime, fmtMinutes, daysBetween } from '../util.js';

export function habitRow(state, h, date) {
  const done = isDone(state, h.id, date);
  const st = streak(state, h, date);
  return `
    <li class="habit${done ? ' done' : ''}">
      <button class="check" data-toggle="${h.id}" aria-pressed="${done}" aria-label="${done ? 'Undo' : 'Done'}: ${esc(h.name)}">${done ? '✓' : ''}</button>
      <span class="h-emoji" aria-hidden="true">${esc(h.emoji)}</span>
      <span class="h-main"><b>${esc(h.name)}</b>${h.time ? `<small>${fmtTime(h.time)}</small>` : ''}${h.notes ? `<small class="notes">${esc(h.notes)}</small>` : ''}</span>
      ${st ? `<span class="streak" title="Current streak">🔥${st}</span>` : ''}
    </li>`;
}

export function groupedHabits(state, date) {
  const due = state.habits.filter((h) => isDue(h, date)).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  const groups = {};
  for (const h of due) (groups[h.area || 'Other'] ||= []).push(h);
  return { due, groups };
}

export function render({ state }) {
  const today = ymd();
  const now = new Date();
  const { due, groups } = groupedHabits(state, today);
  const done = due.filter((h) => isDone(state, h.id, today)).length;
  const c = challengeStats(state, today);
  const pct = Math.min(100, (c.learned / state.challenge.goal) * 100);
  const next = state.alarms.map((a) => ({ a, at: nextOccurrence(a, now) })).filter((x) => x.at).sort((x, y) => x.at - y.at)[0];
  const learning = state.skills.filter((s) => s.status === 'learning').slice(0, 4);
  const events = state.events.filter((e) => e.date === today).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const hour = now.getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const vibe = AESTHETICS[state.answers.aesthetic];
  const pace = c.ahead >= 0 ? `On track${c.ahead > 0 ? ` · ${c.ahead} ahead` : ''}` : `${-c.ahead} behind pace`;

  const lb = state.settings.lastBackup;
  const needBackup = hasContent(state) && (lb ? daysBetween(lb, today) >= state.settings.backupReminderDays : daysBetween(state.challenge.start, today) >= 2);

  return `
    <section>
      ${needBackup ? `<a class="card warn-card" href="#settings">💾 ${lb ? `It's been ${daysBetween(lb, today)} days since your last backup.` : 'Save your first backup so your progress is safe.'} <b>Back up now →</b></a>` : ''}
      <p class="muted small">${now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      <h1>${hello}.</h1>
      ${state.answers.why ? `<p class="lead quote">“${esc(state.answers.why)}”</p>` : vibe ? `<p class="lead">${esc(vibe.words)}</p>` : ''}

      <div class="cards2">
        <a class="card stat" href="#skills">
          <div class="ring" style="--p:${pct}"><span>${c.learned}</span></div>
          <div><b>${c.learned} / ${state.challenge.goal} skills</b><small>Day ${c.elapsed} of ${state.challenge.days}</small><small class="${c.ahead >= 0 ? 'good' : 'warn'}">${pace}</small></div>
        </a>
        <a class="card stat" href="#habits">
          <div class="ring" style="--p:${due.length ? (done / due.length) * 100 : 0}"><span>${done}</span></div>
          <div><b>${done} / ${due.length} habits</b><small>done today</small></div>
        </a>
      </div>

      ${next ? `<a class="card next-alarm${next.a.important ? ' important' : ''}" href="#alarms">⏰ <b>${fmtTime(next.a.time)}</b> ${esc(next.a.label)}${next.a.important ? ' <span class="pill danger">important</span>' : ''}<small>${next.at.toDateString() === now.toDateString() ? 'today' : next.at.toLocaleDateString(undefined, { weekday: 'long' })}</small></a>` : ''}

      ${events.length ? `<h2>Today's plans</h2><ul class="list">${events.map((e) => `<li class="item">📅 <b>${e.time ? fmtTime(e.time) + ' · ' : ''}${esc(e.title)}</b></li>`).join('')}</ul>` : ''}

      ${learning.length ? `<h2>Learning now</h2><ul class="list">${learning.map((s) => `<li class="item"><span>🎯 <b>${esc(s.name)}</b> <small class="muted">${fmtMinutes(skillMinutes(state, s.id))} practised</small></span><a class="btn small" href="#timer/skill/${s.id}">Practise</a></li>`).join('')}</ul>` : ''}

      <h2>Today's habits</h2>
      ${due.length ? Object.entries(groups).map(([area, list]) => `<h4 class="cat">${esc(area)}</h4><ul class="habits">${list.map((h) => habitRow(state, h, today)).join('')}</ul>`).join('') : `<p class="empty">No habits for today. <a href="#habits">Add one</a> or <a href="#quiz">answer the questions</a> to build a plan.</p>`}
    </section>`;
}

export function mount(root, app) {
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toggle]');
    if (!b) return;
    toggleHabit(app.state, b.dataset.toggle, ymd());
    navigator.vibrate?.(15);
    app.save();
    app.render();
  });
}
