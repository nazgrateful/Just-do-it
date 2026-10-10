import { nextOccurrence, androidAlarmIntent, iosShortcutUrl, shortcutLines } from '../alarmcore.js';
import { buildIcs } from '../ics.js';
import { testRing, unlockAudio } from '../ring.js';
import { openSheet, daysPicker, readDays, field } from './sheet.js';
import { downloadFile } from './files.js';
import { dndGuide } from './guide.js';
import { esc, fmtTime, daysLabel, uid, $ } from '../util.js';

let nightLock = null;

function phoneButtons(platform, a) {
  const fallback = location.href.split('#')[0] + '#alarms';
  if (platform === 'android') return `<a class="btn small" href="${esc(androidAlarmIntent(a, fallback))}">⏰ Add to Clock</a>`;
  if (platform === 'ios') return `<a class="btn small" href="${esc(iosShortcutUrl([a]))}">⏰ Send to Clock</a>`;
  return '';
}

export function render({ state }) {
  const p = state.settings.platform;
  const now = new Date();
  const list = [...state.alarms].sort((a, b) => a.time.localeCompare(b.time));
  const important = list.filter((a) => a.important && a.enabled);
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  return `
    <section>
      <div class="title-row"><h1>Alarms</h1><button class="btn primary" data-new>+ Alarm</button></div>
      ${perm !== 'granted' ? `<div class="card warn-card">🔔 Notifications are off, so alarms only ring while the app is open. <button class="btn small" data-perm>Turn on</button></div>` : ''}
      ${
        list.length
          ? `<ul class="list">${list
              .map((a) => {
                const next = nextOccurrence(a, now);
                return `
          <li class="item alarm${a.enabled ? '' : ' off'}${a.important ? ' important' : ''}">
            <div class="a-main" data-edit="${a.id}">
              <span class="a-time">${fmtTime(a.time)}</span>
              <span class="h-main"><b>${esc(a.label)}</b><small>${daysLabel(a.days)}${next ? ' · next ' + next.toLocaleDateString(undefined, { weekday: 'short' }) : ''}</small></span>
            </div>
            <label class="switch"><input type="checkbox" data-enable="${a.id}" ${a.enabled ? 'checked' : ''}><i></i><span class="sr">On</span></label>
            ${a.important ? `<div class="a-actions"><span class="pill danger">‼️ important</span>${phoneButtons(p, a)}</div>` : ''}
          </li>`;
              })
              .join('')}</ul>`
          : '<p class="empty">No alarms yet.</p>'
      }

      <div class="card important-card">
        <h3>‼️ Important alarms & Do Not Disturb</h3>
        <p class="small">Alarms you mark <b>important</b> ring louder, vibrate, keep going until you dismiss them and stay on the lock screen.
        To make them ring even in Do Not Disturb, put them in your phone's own Clock app:</p>
        ${
          p === 'ios'
            ? `<a class="btn primary" href="${esc(iosShortcutUrl(important))}" ${important.length ? '' : 'aria-disabled="true"'}>⏰ Send all ${important.length} important alarms to iPhone Clock</a>
               <p class="small muted">Needs the one-time “Just Do It Alarms” shortcut — see the iPhone guide below.</p>`
            : p === 'android'
              ? `<p class="small">Tap <b>Add to Clock</b> next to each important alarm above, then tap Save in the Clock app.</p>`
              : `<p class="small">On your phone, open this app and use the <b>Add to Clock</b> buttons. On a computer, use the calendar export.</p>`
        }
        <div class="row wrap">
          <button class="btn" data-ics="important">Export important alarms (.ics)</button>
          <button class="btn" data-ics="all">Export all alarms (.ics)</button>
          <button class="btn" data-copy>Copy alarm list</button>
          <button class="btn" data-test>🔊 Test important alarm</button>
          <button class="btn" data-night>🌙 Alarm clock mode</button>
        </div>
        <label class="field inline">Device <select class="input" data-platform>${['ios', 'android', 'desktop'].map((x) => `<option value="${x}"${x === p ? ' selected' : ''}>${{ ios: 'iPhone / iPad', android: 'Android', desktop: 'Computer' }[x]}</option>`).join('')}</select></label>
      </div>

      <h2>How to make alarms break through Do Not Disturb</h2>
      ${dndGuide(p)}
    </section>`;
}

function edit(app, a) {
  const isNew = !a;
  a ||= { id: uid(), label: '', time: '07:00', days: [], important: false, enabled: true, link: null };
  openSheet(
    `<h2>${isNew ? 'New alarm' : 'Edit alarm'}</h2>
     ${field('Time', `<input class="input big-time" type="time" name="time" required value="${a.time}">`)}
     ${field('Label', `<input class="input" name="label" value="${esc(a.label)}" placeholder="e.g. Gym — just do it">`)}
     <div class="field"><span>Repeat</span>${daysPicker(a.days)}</div>
     <label class="toggle-row"><span><b>‼️ Important</b><small>Louder, keeps ringing, and you can send it to your phone's Clock so it breaks through Do Not Disturb.</small></span>
       <span class="switch"><input type="checkbox" name="important" ${a.important ? 'checked' : ''}><i></i></span></label>
     <div class="sheet-actions">${isNew ? '' : '<button class="btn danger" value="delete">Delete</button>'}<button class="btn" value="cancel" formnovalidate>Cancel</button><button class="btn primary" value="save">Save</button></div>`,
    (fd, action, form) => {
      if (action === 'delete') app.state.alarms = app.state.alarms.filter((x) => x.id !== a.id);
      else {
        const days = readDays(form);
        if (!days.length) return alert('Pick at least one day'), false;
        Object.assign(a, { time: fd.get('time'), label: fd.get('label').trim() || 'Alarm', days, important: fd.get('important') === 'on' });
        if (isNew) app.state.alarms.push(a);
        if (a.important && app.state.settings.platform !== 'desktop') app.toast('Tap “Add to Clock” so it breaks through Do Not Disturb');
      }
      app.save();
      app.render();
    },
  );
}

async function alarmClockMode(app) {
  unlockAudio();
  const el = $('#night');
  const draw = () => {
    const now = new Date();
    const next = app.state.alarms.map((a) => ({ a, at: nextOccurrence(a, now) })).filter((x) => x.at).sort((x, y) => x.at - y.at)[0];
    el.innerHTML = `<div class="night-time">${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
      ${next ? `<div class="night-next">⏰ ${fmtTime(next.a.time)} · ${esc(next.a.label)}</div>` : ''}
      <p class="small">Keep the phone on the charger with this screen open. Alarms will ring out loud.</p>
      <button class="btn" data-exit>Exit</button>`;
  };
  draw();
  el.hidden = false;
  const iv = setInterval(draw, 15000);
  try {
    nightLock = await navigator.wakeLock?.request('screen');
  } catch {}
  el.onclick = (e) => {
    if (!e.target.closest('[data-exit]')) return;
    clearInterval(iv);
    el.hidden = true;
    nightLock?.release().catch(() => {});
    nightLock = null;
  };
}

export function mount(root, app) {
  const state = app.state;
  root.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.closest('[aria-disabled="true"]')) return e.preventDefault(), app.toast('Mark an alarm as important first');
    if (t.closest('[data-new]')) return edit(app);
    const ed = t.closest('[data-edit]');
    if (ed) return edit(app, state.alarms.find((a) => a.id === ed.dataset.edit));
    if (t.closest('[data-perm]')) {
      await Notification.requestPermission?.();
      return app.render();
    }
    const ics = t.closest('[data-ics]');
    if (ics) {
      const only = ics.dataset.ics === 'important';
      downloadFile(only ? 'just-do-it-important-alarms.ics' : 'just-do-it-alarms.ics', buildIcs(state, { habits: false, events: false, importantOnly: only }), 'text/calendar');
      return;
    }
    if (t.closest('[data-copy]')) {
      const text = shortcutLines(state.alarms.filter((a) => a.enabled));
      try {
        await navigator.clipboard.writeText(text);
        app.toast('Copied — paste into any alarm or notes app');
      } catch {
        prompt('Copy this:', text);
      }
      return;
    }
    if (t.closest('[data-test]')) return testRing({ id: 'test', label: 'Test — important alarm', time: new Date().toTimeString().slice(0, 5), important: true }, () => state);
    if (t.closest('[data-night]')) return alarmClockMode(app);
  });
  root.addEventListener('change', (e) => {
    const en = e.target.closest('[data-enable]');
    if (en) {
      state.alarms.find((a) => a.id === en.dataset.enable).enabled = en.checked;
      app.save();
      return app.render();
    }
    if (e.target.matches('[data-platform]')) {
      state.settings.platform = e.target.value;
      app.save();
      app.render();
    }
  });
}
