// All data lives in one localStorage key. Pure helpers (streaks, pace) are exported for tests.
import { ymd, addDays, daysBetween, weekday } from './util.js';

export const KEY = 'just-do-it-v1';
export const SCHEMA = 1;

export function defaultState(today = ymd()) {
  return {
    schema: SCHEMA,
    onboarded: false,
    answers: {},
    habits: [],
    log: {}, // { 'YYYY-MM-DD': { habitId: true } }
    skills: [],
    sessions: [], // { id, skillId, minutes, date }
    events: [], // { id, title, date, time, minutes, area, notes }
    alarms: [], // { id, label, time, days, important, enabled, link }
    inventory: [], // { id, name, room, category, status, notes }
    people: [], // { id, name, relation, behave, treated, boundaries, contact, notes }
    challenge: { start: today, goal: 100, days: 365 },
    settings: { theme: 'auto', sound: 'chime', volume: 0.8, snooze: 9, dndSetupDone: false, platform: '', lastBackup: '', backupReminderDays: 7 },
  };
}

/** Fill in any fields missing from older or partial saved data (never removes anything). */
export function migrate(raw, today = ymd()) {
  const base = defaultState(today);
  if (!raw || typeof raw !== 'object') return base;
  const s = { ...base, ...raw };
  s.challenge = { ...base.challenge, ...(raw.challenge || {}) };
  s.settings = { ...base.settings, ...(raw.settings || {}) };
  for (const k of ['habits', 'skills', 'sessions', 'events', 'alarms', 'inventory', 'people']) if (!Array.isArray(s[k])) s[k] = [];
  if (!s.log || typeof s.log !== 'object') s.log = {};
  s.schema = SCHEMA;
  return s;
}

/** Keys used to protect data. They are never deleted by the app. */
export const SNAPSHOT_KEY = KEY + '.daily-snapshot';
export const BEFORE_RESTORE_KEY = KEY + '.before-restore';
export const upgradeBackupKey = (n) => `${KEY}.backup-v${n}`;

/**
 * Load saved data. Safety rules:
 * - Saved data from an older version is upgraded by adding fields, never by removing them,
 *   and an untouched copy is kept first.
 * - Unreadable data is copied aside (never overwritten) so it can be recovered.
 */
export function load(storage = globalThis.localStorage) {
  let text = null;
  try {
    text = storage.getItem(KEY);
  } catch {
    return defaultState();
  }
  if (text == null) return defaultState();
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    try {
      storage.setItem(`${KEY}.unreadable-${Date.now()}`, text);
    } catch {}
    return defaultState();
  }
  if (raw && typeof raw === 'object' && (raw.schema || 0) < SCHEMA) {
    try {
      const k = upgradeBackupKey(raw.schema || 0);
      if (storage.getItem(k) == null) storage.setItem(k, text);
    } catch {}
  }
  return migrate(raw);
}

export function save(state, storage = globalThis.localStorage) {
  let previous = null;
  try {
    previous = storage.getItem(KEY);
  } catch {}
  try {
    storage.setItem(KEY, JSON.stringify(state));
  } catch {
    return false;
  }
  // Once a day, keep the data as it was *before* today's first change, so a reset
  // or a bad import can be undone. An empty app never replaces a real snapshot.
  try {
    const snap = JSON.parse(storage.getItem(SNAPSHOT_KEY) || 'null');
    if (previous && (!snap || snap.date !== ymd()) && hasContent(JSON.parse(previous))) {
      storage.setItem(SNAPSHOT_KEY, JSON.stringify({ date: ymd(), data: JSON.parse(previous) }));
    }
  } catch {}
  return true;
}

export function hasContent(s) {
  return !!s && ['habits', 'skills', 'alarms', 'events', 'inventory', 'people'].some((k) => Array.isArray(s[k]) && s[k].length);
}

// ---------------------------------------------------------------- habits

export const isDue = (habit, date) => !habit.days?.length || habit.days.includes(weekday(date));
export const isDone = (state, habitId, date) => !!state.log[date]?.[habitId];

export function toggleHabit(state, habitId, date) {
  const day = (state.log[date] ||= {});
  if (day[habitId]) delete day[habitId];
  else day[habitId] = true;
  if (!Object.keys(day).length) delete state.log[date];
}

/**
 * Current streak: consecutive due days completed, counting back from today.
 * Today not yet done doesn't break the streak.
 */
export function streak(state, habit, today = ymd()) {
  let n = 0;
  let d = today;
  if (isDue(habit, d) && !isDone(state, habit.id, d)) d = addDays(d, -1);
  for (let i = 0; i < 400; i++, d = addDays(d, -1)) {
    if (habit.createdAt && d < habit.createdAt) break;
    if (!isDue(habit, d)) continue;
    if (!isDone(state, habit.id, d)) break;
    n++;
  }
  return n;
}

export function bestStreak(state, habit, today = ymd()) {
  let best = 0;
  let run = 0;
  const start = habit.createdAt || addDays(today, -365);
  for (let d = start; d <= today; d = addDays(d, 1)) {
    if (!isDue(habit, d)) continue;
    if (isDone(state, habit.id, d)) best = Math.max(best, ++run);
    else if (d !== today) run = 0;
  }
  return best;
}

/** Fraction of due habits done on a date (null if nothing was due). */
export function dayScore(state, date) {
  const due = state.habits.filter((h) => isDue(h, date) && (!h.createdAt || h.createdAt <= date));
  if (!due.length) return null;
  return due.filter((h) => isDone(state, h.id, date)).length / due.length;
}

// ---------------------------------------------------------------- skills challenge

export function challengeStats(state, today = ymd()) {
  const { start, goal, days } = state.challenge;
  const elapsed = Math.min(days, Math.max(0, daysBetween(start, today) + 1));
  const learned = state.skills.filter((s) => s.status === 'learned').length;
  const learning = state.skills.filter((s) => s.status === 'learning').length;
  const expected = Math.round((goal * elapsed) / days);
  const remainingDays = Math.max(0, days - elapsed);
  const left = Math.max(0, goal - learned);
  return {
    elapsed, learned, learning, expected, remainingDays, left,
    planned: state.skills.length,
    ahead: learned - expected,
    daysPerSkill: left ? Math.max(0, remainingDays) / left : 0,
    end: addDays(start, days - 1),
  };
}

export function skillMinutes(state, skillId) {
  return state.sessions.filter((s) => s.skillId === skillId).reduce((t, s) => t + s.minutes, 0);
}

export function logSession(state, skillId, minutes, date = ymd(), id = Date.now().toString(36)) {
  if (!skillId || minutes <= 0) return;
  state.sessions.push({ id, skillId, minutes: Math.round(minutes), date });
  const sk = state.skills.find((s) => s.id === skillId);
  if (sk && sk.status === 'todo') sk.status = 'learning';
}
