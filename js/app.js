import { load, save as persist } from './store.js';
import { AESTHETICS } from './data.js';
import { startRinger } from './ring.js';
import { detectPlatform } from './alarmcore.js';
import { $, $$ } from './util.js';
import { APP_VERSION, RELEASES } from './version.js';
import * as today from './views/today.js';
import * as habits from './views/habits.js';
import * as skills from './views/skills.js';
import * as calendar from './views/calendar.js';
import * as timer from './views/timer.js';
import * as alarms from './views/alarms.js';
import * as vision from './views/vision.js';
import * as settings from './views/settings.js';
import * as quiz from './views/quiz.js';

const VIEWS = { today, habits, skills, calendar, timer, alarms, vision, settings, quiz };

let state = load();
if (!state.settings.platform) state.settings.platform = detectPlatform();

const app = {
  get state() {
    return state;
  },
  set state(s) {
    state = s;
  },
  save() {
    if (!persist(state)) toast('⚠️ Could not save — storage is full or blocked');
  },
  go(view) {
    location.hash = view;
  },
  render,
  toast,
  applyTheme,
};

let current = null;

function render() {
  const name = location.hash.slice(1).split('/')[0] || (state.onboarded ? 'today' : 'quiz');
  const view = VIEWS[name] || today;
  if (current && current !== view) current.leave?.();
  current = view;
  // A fresh element each time so listeners added by the previous screen are dropped.
  const old = $('#view');
  const root = old.cloneNode(false);
  old.replaceWith(root);
  root.innerHTML = view.render(app);
  view.mount?.(root, app);
  $$('.tabbar button').forEach((b) => b.setAttribute('aria-current', b.dataset.view === name ? 'page' : 'false'));
  document.body.dataset.view = name;
}

function applyTheme() {
  const a = AESTHETICS[state.answers.aesthetic] || AESTHETICS.serene;
  const pref = state.settings.theme;
  const dark = pref === 'dark' || (pref === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  const r = document.documentElement.style;
  r.setProperty('--accent', dark ? a.accentDark : a.accent);
  r.setProperty('--accent2', (dark ? a.accent2Dark : a.accent2) || (dark ? a.accentDark : a.accent));
  r.setProperty('--bg', dark ? a.dbg : a.bg);
  r.setProperty('--surface', dark ? a.dsurface : a.surface);
  r.setProperty('--ink', dark ? a.dink : a.ink);
  document.documentElement.dataset.font = a.font;
  document.documentElement.dataset.style = a.style || 'serene';
  document.documentElement.dataset.dark = dark ? '1' : '0';
  $('meta[name=theme-color]')?.setAttribute('content', dark ? a.dbg : a.bg);
}

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

$('.tabbar').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-view]');
  if (b) app.go(b.dataset.view);
});
$('#topbar-actions').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-view]');
  if (b) app.go(b.dataset.view);
});
window.addEventListener('hashchange', render);
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);

applyTheme();
render();
startRinger(() => state);

// ---- Updates: a new version waits until you tap Update; your data is never touched.
function showUpdateBar(worker) {
  const bar = $('#update-bar');
  bar.hidden = false;
  $('#update-now').onclick = () => worker.postMessage('skipWaiting');
  $('#update-later').onclick = () => (bar.hidden = true);
}
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker
    .register('sw.js')
    .then((reg) => {
      if (reg.waiting && navigator.serviceWorker.controller) showUpdateBar(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w?.addEventListener('statechange', () => w.state === 'installed' && navigator.serviceWorker.controller && showUpdateBar(w));
      });
      // Check for a new version when the app comes back to the front.
      document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && reg.update().catch(() => {}));
    })
    .catch(() => {});
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return;
    reloaded = true;
    location.reload();
  });
}

// ---- After an update: say what changed, confirm data was kept, offer a backup.
const SEEN = 'just-do-it.seen-version';
try {
  const seen = localStorage.getItem(SEEN);
  if (seen && seen !== APP_VERSION) {
    const notes = RELEASES.filter((r) => r.version !== seen).slice(0, 3);
    const d = $('#whats-new');
    d.innerHTML = `<form method="dialog" class="sheet-body">
      <h2>✨ Just Do It was updated</h2>
      <p class="good"><b>All your data was kept:</b> ${state.habits.length} habits, ${state.skills.length} skills, ${state.alarms.length} alarms.</p>
      ${notes.map((r) => `<p><b>${r.version}</b></p><ul class="small">${r.notes.map((n) => `<li>${n}</li>`).join('')}</ul>`).join('')}
      <p class="small">Tip: save a backup now and then (Settings → Save backup) so your data is safe even if you change phones.</p>
      <div class="sheet-actions"><a class="btn" href="#settings" onclick="this.closest('dialog').close()">Save a backup</a><button class="btn primary">Got it</button></div>
    </form>`;
    d.showModal();
  }
  localStorage.setItem(SEEN, APP_VERSION);
} catch {}
// Ask the browser not to clear our data when space is low.
navigator.storage?.persist?.().catch(() => {});
