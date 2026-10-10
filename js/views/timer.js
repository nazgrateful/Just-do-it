// Timer: countdown, focus (pomodoro) and stopwatch. Time can be logged to a skill.
import { logSession } from '../store.js';
import { previewSound, unlockAudio } from '../ring.js';
import { armTimerSound, disarmTimerSound, timerSoundArmed, setLockScreenStop, androidTimerIntent, MAX_SECONDS } from '../timeraudio.js';
import { esc, fmtDuration, $ } from '../util.js';

const PRESETS = [5, 10, 15, 20, 25, 30, 45, 60, 90];
const t = {
  mode: 'countdown', // countdown | focus | stopwatch
  length: 25 * 60,
  running: false,
  endAt: 0,
  startedAt: 0,
  elapsedBefore: 0, // stopwatch / paused countdown progress (seconds)
  skillId: '',
  focusRound: 1,
  onBreak: false,
  ringing: false, // the end-of-timer alarm is sounding
  backgroundOk: false, // the screen-off track is playing
};
let ticker = null;
let wakeLock = null;
let appRef = null;

const remaining = () => (t.running ? Math.max(0, (t.endAt - Date.now()) / 1000) : t.length - t.elapsedBefore);
const elapsed = () => (t.running ? t.elapsedBefore + (Date.now() - t.startedAt) / 1000 : t.elapsedBefore);

async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    else if (!on) await wakeLock?.release(), (wakeLock = null);
  } catch {}
}

function finish() {
  const app = appRef;
  const mins = t.mode === 'stopwatch' ? elapsed() / 60 : t.length / 60;
  t.running = false;
  clearInterval(ticker);
  ticker = null;
  keepAwake(false);
  if (timerSoundArmed()) {
    // The screen-off track is already ringing (or about to); keep it going until Stop.
    showTimesUp(app);
  } else {
    previewSound(() => app.state, true);
    setTimeout(() => previewSound(() => app.state, true), 1500);
  }
  navigator.vibrate?.([400, 150, 400]);
  if (t.skillId && !t.onBreak && mins >= 1) {
    logSession(app.state, t.skillId, mins);
    app.save();
    app.toast(`Logged ${Math.round(mins)} min of practice`);
  } else app.toast(t.onBreak ? 'Break over — back to it' : 'Time!');
  if (t.mode === 'focus') {
    t.onBreak = !t.onBreak;
    if (!t.onBreak) t.focusRound++;
    t.length = (t.onBreak ? (t.focusRound % 4 === 0 ? 15 : 5) : 25) * 60;
  }
  t.elapsedBefore = 0;
  if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
    try {
      new Notification('⏱ Timer finished', { body: t.onBreak ? 'Take a break' : 'Nice work' });
    } catch {}
  }
  if (location.hash.startsWith('#timer')) app.render();
}

function stopRinging() {
  disarmTimerSound();
  t.ringing = false;
  t.backgroundOk = false;
  const el = $('#alarm-overlay');
  if (el?.dataset.timer) {
    el.hidden = true;
    el.innerHTML = '';
    delete el.dataset.timer;
  }
}
setLockScreenStop(() => {
  if (t.running) pause();
  stopRinging();
  appRef && location.hash.startsWith('#timer') && appRef.render();
});

function showTimesUp(app) {
  t.ringing = true;
  const el = $('#alarm-overlay');
  el.dataset.timer = '1';
  el.classList.remove('important');
  el.innerHTML = `<div class="alarm-card"><div class="alarm-time">⏱</div><div class="alarm-label">Time's up!</div>
    <button class="btn big primary" data-timer-stop>Stop</button></div>`;
  el.hidden = false;
  el.onclick = (e) => {
    if (!e.target.closest('[data-timer-stop]')) return;
    stopRinging();
    if (location.hash.startsWith('#timer')) app.render();
  };
}

function pause() {
  t.elapsedBefore = t.mode === 'stopwatch' ? elapsed() : t.length - remaining();
  t.running = false;
  clearInterval(ticker);
  ticker = null;
  keepAwake(false);
  stopRinging();
}

function update() {
  const el = $('#t-display');
  if (t.mode !== 'stopwatch' && t.running && remaining() <= 0) return finish();
  if (!el) return;
  el.textContent = fmtDuration(t.mode === 'stopwatch' ? elapsed() : remaining());
  const ring = $('#t-ring');
  if (ring && t.mode !== 'stopwatch') ring.style.setProperty('--p', (1 - remaining() / t.length) * 100);
  document.title = t.running ? `${el.textContent} · Just Do It` : 'Just Do It';
}

export function render({ state }) {
  const pre = location.hash.match(/^#timer\/skill\/(.+)/);
  if (pre && !t.running) t.skillId = pre[1];
  const skills = state.skills.filter((s) => s.status !== 'learned');
  const shown = t.mode === 'stopwatch' ? elapsed() : remaining();
  return `
    <section class="timer">
      <h1>Timer</h1>
      <div class="chips seg">${['countdown', 'focus', 'stopwatch'].map((m) => `<button class="chip${t.mode === m ? ' on' : ''}" data-mode="${m}" ${t.running ? 'disabled' : ''}>${{ countdown: 'Countdown', focus: 'Focus 25/5', stopwatch: 'Stopwatch' }[m]}</button>`).join('')}</div>
      <div id="t-ring" class="big-ring${t.mode === 'stopwatch' ? ' sw' : ''}" style="--p:${t.mode === 'stopwatch' ? 0 : (1 - shown / t.length) * 100}">
        <div><div id="t-display" class="t-display">${fmtDuration(shown)}</div>${t.mode === 'focus' ? `<small>${t.onBreak ? 'Break' : `Focus round ${t.focusRound}`}</small>` : ''}</div>
      </div>
      ${t.mode === 'countdown' && !t.running ? `<div class="chips center">${PRESETS.map((m) => `<button class="chip${t.length === m * 60 ? ' on' : ''}" data-len="${m}">${m}m</button>`).join('')}<label class="chip custom">⏲ <input type="number" min="1" max="600" id="t-custom" placeholder="min"></label></div>` : ''}
      <div class="t-controls">
        ${t.running ? '<button class="btn big" data-act="pause">Pause</button>' : `<button class="btn big primary" data-act="start">${t.elapsedBefore ? 'Resume' : 'Start'}</button>`}
        <button class="btn big" data-act="reset">${t.mode === 'stopwatch' && t.elapsedBefore && !t.running ? 'Save & reset' : 'Reset'}</button>
      </div>
      <label class="field"><span>Log this time to a skill</span>
        <select class="input" id="t-skill"><option value="">— none —</option>${skills.map((s) => `<option value="${s.id}"${s.id === t.skillId ? ' selected' : ''}>${esc(s.category)} · ${esc(s.name)}</option>`).join('')}</select>
      </label>
      ${t.mode !== 'stopwatch' ? `<div class="card small timer-note">
        ${t.running && t.backgroundOk ? '🔊 <b>Ready to ring with the screen off.</b>' : '🔊 <b>Rings even when the screen is off.</b>'}
        You can lock your phone. Just don't swipe the app closed, and keep your media volume up.
        ${state.settings.platform === 'android' && !t.running ? `<div class="row wrap"><a class="btn small" href="${esc(androidTimerIntent(t.length - t.elapsedBefore, 'Just Do It timer', location.href.split('#')[0] + '#timer'))}">⏰ Also set it in my Clock app</a></div>` : ''}
        ${t.length - t.elapsedBefore > MAX_SECONDS ? '<p class="warn">Timers over 4 hours only ring while the app is open — use your Clock app for those.</p>' : ''}
      </div>` : ''}
    </section>`;
}

export function mount(root, app) {
  appRef = app;
  if (t.running && !ticker) ticker = setInterval(update, 250);
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.mode) {
      t.mode = b.dataset.mode;
      t.elapsedBefore = 0;
      t.onBreak = false;
      t.focusRound = 1;
      t.length = t.mode === 'focus' ? 25 * 60 : t.length;
      return app.render();
    }
    if (b.dataset.len) return (t.length = Number(b.dataset.len) * 60), (t.elapsedBefore = 0), app.render();
    const act = b.dataset.act;
    if (act === 'start') {
      unlockAudio();
      stopRinging();
      t.running = true;
      t.startedAt = Date.now();
      t.endAt = Date.now() + (t.length - t.elapsedBefore) * 1000;
      ticker = setInterval(update, 250);
      keepAwake(true);
      if (t.mode !== 'stopwatch') {
        // Started inside the tap so the browser allows the sound.
        armTimerSound((t.endAt - Date.now()) / 1000, {
          volume: app.state.settings.volume,
          label: `⏱ ${t.mode === 'focus' ? (t.onBreak ? 'Break' : 'Focus') : 'Timer'}`,
          endsAt: new Date(t.endAt),
        }).then((ok) => {
          t.backgroundOk = ok && t.running;
          if (location.hash.startsWith('#timer')) app.render();
        });
      }
      app.render();
    } else if (act === 'pause') {
      pause();
      app.render();
    } else if (act === 'reset') {
      stopRinging();
      if (t.mode === 'stopwatch' && !t.running && t.skillId && t.elapsedBefore >= 60) {
        logSession(app.state, t.skillId, t.elapsedBefore / 60);
        app.save();
        app.toast(`Logged ${Math.round(t.elapsedBefore / 60)} min of practice`);
      }
      t.running = false;
      t.elapsedBefore = 0;
      clearInterval(ticker);
      ticker = null;
      keepAwake(false);
      document.title = 'Just Do It';
      app.render();
    }
  });
  root.addEventListener('change', (e) => {
    if (e.target.id === 't-skill') t.skillId = e.target.value;
    if (e.target.id === 't-custom' && Number(e.target.value) > 0) {
      t.length = Math.round(Number(e.target.value) * 60);
      t.elapsedBefore = 0;
      app.render();
    }
  });
}

// The ticker keeps running when you switch screens so the timer still finishes.
