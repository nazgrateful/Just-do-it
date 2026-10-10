// In-app alarm ringer: checks alarms every few seconds while the app is open,
// shows a full-screen alarm, plays a looping sound and vibrates.
// Important alarms ring louder, longer, vibrate, and keep their notification on screen.
import { dueAlarms } from './alarmcore.js';
import { fmtTime, esc, $ } from './util.js';
import { disarmTimerSound } from './timeraudio.js';

let ctx = null;
let loop = null;
let vibrateLoop = null;
let lastCheck = new Date();
let active = null; // { alarm, snoozeCount }
const snoozes = []; // { alarm, at }

/** iOS 17+: play through the silent switch. Safe no-op elsewhere. */
function playbackSession() {
  try {
    if (navigator.audioSession) navigator.audioSession.type = 'playback';
  } catch {}
}

export function unlockAudio() {
  playbackSession();
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {}
}

function beepPattern(volume, important) {
  if (!ctx) return;
  const t0 = ctx.currentTime;
  const notes = important ? [880, 1175, 880, 1175, 1568] : [660, 880, 990];
  notes.forEach((f, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = important ? 'square' : 'sine';
    o.frequency.value = f;
    const start = t0 + i * 0.22;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * (important ? 0.6 : 0.4)), start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
    o.connect(g).connect(ctx.destination);
    o.start(start);
    o.stop(start + 0.21);
  });
}

export function previewSound(getState, important = false) {
  unlockAudio();
  beepPattern(getState().settings.volume, important);
}

function stopSound() {
  clearInterval(loop);
  clearInterval(vibrateLoop);
  loop = vibrateLoop = null;
  try {
    navigator.vibrate?.(0);
  } catch {}
}

async function notify(alarm) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const opts = {
    body: alarm.important ? 'IMPORTANT alarm — tap to open' : 'Tap to open Just Do It',
    tag: 'alarm-' + alarm.id,
    renotify: true,
    requireInteraction: !!alarm.important,
    silent: false,
    vibrate: alarm.important ? [600, 200, 600, 200, 600] : [300],
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    data: { url: './#alarms' },
  };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) return reg.showNotification(`⏰ ${alarm.label || 'Alarm'}`, opts);
    new Notification(`⏰ ${alarm.label || 'Alarm'}`, opts);
  } catch {}
}

function ring(alarm, getState) {
  if (active) stopSound();
  active = { alarm };
  const vol = getState().settings.volume;
  unlockAudio();
  beepPattern(vol, alarm.important);
  loop = setInterval(() => beepPattern(vol, alarm.important), alarm.important ? 1400 : 2200);
  if (navigator.vibrate) {
    const pat = alarm.important ? [700, 300, 700, 300, 700] : [400, 400];
    navigator.vibrate(pat);
    vibrateLoop = setInterval(() => navigator.vibrate(pat), 2600);
  }
  notify(alarm);
  // Ordinary alarms give up after 2 minutes; important ones keep going until you act.
  if (!alarm.important) setTimeout(() => active?.alarm === alarm && dismiss(), 120000);

  const el = $('#alarm-overlay');
  el.classList.toggle('important', !!alarm.important);
  el.innerHTML = `
    <div class="alarm-card">
      ${alarm.important ? '<div class="pill danger">IMPORTANT</div>' : ''}
      <div class="alarm-time">${fmtTime(alarm.time)}</div>
      <div class="alarm-label">${esc(alarm.label || 'Alarm')}</div>
      <button class="btn big primary" data-alarm="dismiss">I'm up — just do it</button>
      <button class="btn big" data-alarm="snooze">Snooze ${getState().settings.snooze} min</button>
    </div>`;
  el.hidden = false;
  el.onclick = (e) => {
    const act = e.target.closest('[data-alarm]')?.dataset.alarm;
    if (act === 'dismiss') dismiss();
    if (act === 'snooze') {
      snoozes.push({ alarm, at: new Date(Date.now() + getState().settings.snooze * 60000) });
      dismiss();
    }
  };
}

function dismiss() {
  stopSound();
  disarmTimerSound('night'); // night-stand mode's ringing track
  active = null;
  const el = $('#alarm-overlay');
  el.hidden = true;
  el.innerHTML = '';
}

function tick(getState) {
  const now = new Date();
  // If the phone slept for a long time, don't ring a pile of stale alarms: only the last 10 minutes count.
  const since = new Date(Math.max(lastCheck.getTime(), now.getTime() - 10 * 60000));
  lastCheck = now;
  const due = dueAlarms(getState().alarms, since, now);
  for (let i = snoozes.length - 1; i >= 0; i--) {
    if (snoozes[i].at <= now) due.push(snoozes.splice(i, 1)[0]);
  }
  if (due.length) {
    due.sort((a, b) => Number(b.alarm.important) - Number(a.alarm.important));
    ring(due[0].alarm, getState);
  }
}

export function startRinger(getState) {
  lastCheck = new Date();
  setInterval(() => tick(getState), 5000);
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && tick(getState));
  // Browsers only allow sound after a tap, so unlock audio on the first interaction.
  const unlock = () => unlockAudio();
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
}

export const testRing = (alarm, getState) => ring(alarm, getState);
