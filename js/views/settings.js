import { makeBackup, backupName, parseBackup, summary } from '../backup.js';
import { SNAPSHOT_KEY, BEFORE_RESTORE_KEY, defaultState, migrate, save as persist, hasContent } from '../store.js';
import { APP_VERSION, RELEASES } from '../version.js';
import { previewSound } from '../ring.js';
import { downloadFile } from './files.js';
import { dndGuide } from './guide.js';
import { esc, ymd, daysBetween, fmtDate } from '../util.js';

const read = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k) || 'null');
  } catch {
    return null;
  }
};

let persisted = null;
navigator.storage?.persisted?.().then((v) => (persisted = v)).catch(() => {});

export function render({ state }) {
  const st = state.settings;
  const last = st.lastBackup;
  const age = last ? daysBetween(last, ymd()) : null;
  const snap = read(SNAPSHOT_KEY);
  const before = read(BEFORE_RESTORE_KEY);
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  return `
    <section>
      <h1>Settings</h1>

      <div class="card data-card">
        <h2>💾 Your data is safe</h2>
        <ul class="small ticks">
          <li>Everything is stored <b>only on this device</b>: no account, nothing uploaded.</li>
          <li><b>Updates never erase it.</b> New versions only add to your data, and keep an untouched copy of the old data first.</li>
          <li>The app keeps an <b>automatic daily safety copy</b> on this device${snap ? ` (from ${fmtDate(snap.date)})` : ''}.</li>
          <li>${persisted ? '✅ The browser has agreed not to clear your data.' : 'Install the app to your home screen so the browser keeps your data.'}</li>
        </ul>
        <p class="${age == null || age >= st.backupReminderDays ? 'warn' : 'good'} small"><b>${last ? `Last backup: ${fmtDate(last)} (${age === 0 ? 'today' : age + ' days ago'})` : 'You have not saved a backup yet.'}</b>
          A backup file is what keeps your data safe if you lose your phone, clear your browser or switch devices.</p>
        <p class="small muted">${esc(summary(state))}</p>
        <div class="row wrap">
          <button class="btn primary" data-backup>Save backup</button>
          <button class="btn" data-copy>Copy as text</button>
          <label class="btn">Restore from file<input type="file" accept=".json,application/json,text/plain" data-file hidden></label>
          <button class="btn" data-paste>Paste backup text</button>
        </div>
        <p class="small muted">“Save backup” opens your phone's share sheet: choose <b>Save to Files</b>, iCloud Drive, Google Drive or email it to yourself.</p>
        ${before ? `<button class="btn small" data-undo-restore>↩ Undo last restore (${esc(fmtDate(before.date))})</button>` : ''}
        ${snap && hasContent(snap.data) ? `<button class="btn small" data-snapshot>Go back to the safety copy from ${esc(fmtDate(snap.date))}</button>` : ''}
        <label class="field inline">Remind me to back up every <select class="input" data-set="backupReminderDays">${[3, 7, 14, 30].map((n) => `<option value="${n}"${n === st.backupReminderDays ? ' selected' : ''}>${n} days</option>`).join('')}</select></label>
      </div>

      <div class="card">
        <h2>🎨 Look</h2>
        <label class="field inline">Theme <select class="input" data-set="theme">${['auto', 'light', 'dark'].map((t) => `<option${t === st.theme ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
        <a class="btn primary" href="#looks">🎨 Browse all looks</a>
        <p class="small muted">Over 160 aesthetics: colours, lettering, boxes, buttons, shapes and patterns. Or make your own.</p>
      </div>

      <div class="card">
        <h2>🎯 Challenge</h2>
        <div class="row">
          <label class="field"><span>Start date</span><input class="input" type="date" data-ch="start" value="${state.challenge.start}"></label>
          <label class="field"><span>Skills goal</span><input class="input" type="number" min="1" data-ch="goal" value="${state.challenge.goal}"></label>
          <label class="field"><span>Days</span><input class="input" type="number" min="7" data-ch="days" value="${state.challenge.days}"></label>
        </div>
      </div>

      <div class="card">
        <h2>🔔 Notifications & alarms</h2>
        <p class="small">Notifications: <b>${perm}</b></p>
        ${perm === 'default' ? '<button class="btn primary" data-perm>Turn on notifications</button>' : perm === 'denied' ? '<p class="small warn">Blocked. Turn them on in your phone/browser settings for this site.</p>' : ''}
        <label class="field inline">Alarm volume <input type="range" min="0.1" max="1" step="0.1" data-set="volume" value="${st.volume}"></label>
        <label class="field inline">Snooze <select class="input" data-set="snooze">${[5, 9, 10, 15].map((n) => `<option value="${n}"${n === st.snooze ? ' selected' : ''}>${n} min</option>`).join('')}</select></label>
        <button class="btn" data-sound>🔊 Test sound</button>
        <details class="group"><summary><b>Make alarms break through Do Not Disturb</b></summary>${dndGuide(st.platform)}</details>
      </div>

      <div class="card">
        <h2>ℹ️ About</h2>
        <p class="small">Just Do It · version ${APP_VERSION}</p>
        <details class="group"><summary><b>What's new</b></summary>${RELEASES.map((r) => `<p><b>${r.version}</b> <small class="muted">${r.date}</small></p><ul class="small">${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`).join('')}</details>
        <button class="btn danger" data-reset>Start over…</button>
      </div>
    </section>`;
}

/** Replace all data, keeping the current data so the restore can be undone. */
function replaceAll(app, next, msg) {
  try {
    localStorage.setItem(BEFORE_RESTORE_KEY, JSON.stringify({ date: ymd(), data: app.state }));
  } catch {}
  app.state = migrate(next);
  persist(app.state);
  app.applyTheme();
  app.toast(msg);
  app.render();
}

function restoreText(app, text) {
  let next;
  try {
    next = parseBackup(text);
  } catch (e) {
    return alert(e.message);
  }
  if (!confirm(`Restore this backup?\n\n${summary(next)}\n\nYour current data will be replaced. You can undo this afterwards.`)) return;
  replaceAll(app, next, 'Backup restored ✓');
}

export function mount(root, app) {
  const state = app.state;
  const markBackedUp = () => {
    state.settings.lastBackup = ymd();
    app.save();
  };
  root.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.closest('[data-backup]')) {
      await downloadFile(backupName(), makeBackup(state), 'application/json');
      markBackedUp();
      return app.render();
    }
    if (t.closest('[data-copy]')) {
      const text = makeBackup(state);
      try {
        await navigator.clipboard.writeText(text);
        app.toast('Copied — paste it into Notes or an email to yourself');
      } catch {
        prompt('Copy all of this and keep it somewhere safe:', text);
      }
      markBackedUp();
      return app.render();
    }
    if (t.closest('[data-paste]')) {
      const text = prompt('Paste your backup text here:');
      if (text) restoreText(app, text);
      return;
    }
    if (t.closest('[data-undo-restore]')) {
      const b = read(BEFORE_RESTORE_KEY);
      if (b && confirm('Go back to your data from before the last restore?')) replaceAll(app, b.data, 'Restore undone ✓');
      return;
    }
    if (t.closest('[data-snapshot]')) {
      const s = read(SNAPSHOT_KEY);
      if (s && confirm(`Go back to the safety copy from ${fmtDate(s.date)}?\n\n${summary(migrate(s.data))}\n\nYou can undo this.`)) replaceAll(app, s.data, 'Safety copy restored ✓');
      return;
    }
    if (t.closest('[data-perm]')) {
      await Notification.requestPermission();
      return app.render();
    }
    if (t.closest('[data-sound]')) return previewSound(() => state, true);
    if (t.closest('[data-reset]')) {
      if (!confirm('Start over? Save a backup first if you might want your data back.\n\n(The current data is kept as an undo copy on this device.)')) return;
      replaceAll(app, defaultState(), 'Started fresh');
      app.go('quiz');
    }
  });
  root.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('[data-file]') && t.files[0]) {
      t.files[0].text().then((text) => restoreText(app, text));
      t.value = '';
      return;
    }
    if (t.dataset.set) {
      const k = t.dataset.set;
      state.settings[k] = t.type === 'range' || k !== 'theme' ? Number(t.value) : t.value;
      app.save();
      if (k === 'theme') app.applyTheme();
      return;
    }
    if (t.dataset.ch) {
      state.challenge[t.dataset.ch] = t.dataset.ch === 'start' ? t.value : Math.max(1, Number(t.value) || 1);
      app.save();
    }
  });
}

