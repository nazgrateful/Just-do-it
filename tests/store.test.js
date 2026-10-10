import test from 'node:test';
import assert from 'node:assert/strict';
import { load, save, migrate, defaultState, streak, bestStreak, toggleHabit, challengeStats, logSession, KEY, SNAPSHOT_KEY, upgradeBackupKey } from '../js/store.js';
import { memoryStorage } from './helpers.js';

const habit = (days = [0, 1, 2, 3, 4, 5, 6]) => ({ id: 'h1', name: 'Read', days, createdAt: '2026-01-01' });

test('streak counts consecutive due days and ignores not-yet-done today', () => {
  const s = defaultState('2026-01-01');
  s.habits = [habit()];
  for (const d of ['2026-02-07', '2026-02-08', '2026-02-09']) toggleHabit(s, 'h1', d);
  assert.equal(streak(s, s.habits[0], '2026-02-10'), 3);
  toggleHabit(s, 'h1', '2026-02-10');
  assert.equal(streak(s, s.habits[0], '2026-02-10'), 4);
  assert.equal(bestStreak(s, s.habits[0], '2026-02-10'), 4);
});

test('streak skips days the habit is not scheduled', () => {
  const s = defaultState('2026-01-01');
  s.habits = [habit([1, 3, 5])]; // Mon Wed Fri
  // 2026-02-09 is a Monday
  for (const d of ['2026-02-09', '2026-02-11', '2026-02-13']) toggleHabit(s, 'h1', d);
  assert.equal(streak(s, s.habits[0], '2026-02-15'), 3);
});

test('toggling twice removes the check-in', () => {
  const s = defaultState();
  toggleHabit(s, 'x', '2026-03-01');
  toggleHabit(s, 'x', '2026-03-01');
  assert.deepEqual(s.log, {});
});

test('challenge pace', () => {
  const s = defaultState('2026-01-01');
  s.skills = Array.from({ length: 10 }, (_, i) => ({ id: 's' + i, status: i < 4 ? 'learned' : 'todo' }));
  const c = challengeStats(s, '2026-01-30'); // day 30
  assert.equal(c.elapsed, 30);
  assert.equal(c.learned, 4);
  assert.equal(c.expected, Math.round((100 * 30) / 365));
  assert.equal(c.ahead, 4 - 8);
});

test('logging practice starts the skill', () => {
  const s = defaultState();
  s.skills = [{ id: 'a', status: 'todo' }];
  logSession(s, 'a', 25.4, '2026-03-01');
  assert.equal(s.skills[0].status, 'learning');
  assert.equal(s.sessions[0].minutes, 25);
});

test('migrate only adds missing fields and keeps everything else', () => {
  const old = { habits: [{ id: 1 }], custom: 'kept', settings: { volume: 0.3 } };
  const s = migrate(old);
  assert.deepEqual(s.habits, [{ id: 1 }]);
  assert.equal(s.custom, 'kept');
  assert.equal(s.settings.volume, 0.3);
  assert.equal(s.settings.snooze, 9);
  assert.deepEqual(s.inventory, []);
  assert.deepEqual(s.people, []);
});

test('load keeps an untouched copy of older-version data before upgrading', () => {
  const oldText = JSON.stringify({ habits: [{ id: 'h' }] }); // no schema = version 0
  const st = memoryStorage({ [KEY]: oldText });
  const s = load(st);
  assert.equal(s.habits.length, 1);
  assert.equal(st.getItem(upgradeBackupKey(0)), oldText);
});

test('unreadable data is copied aside, not lost', () => {
  const st = memoryStorage({ [KEY]: '{broken' });
  const s = load(st);
  assert.deepEqual(s.habits, []);
  assert.ok(st.keys().some((k) => k.startsWith(KEY + '.unreadable-') && st.getItem(k) === '{broken'));
});

test('save keeps a daily safety copy of the previous data', () => {
  const st = memoryStorage();
  const s = defaultState();
  s.habits = [{ id: 'h' }];
  save(s, st);
  assert.equal(st.getItem(SNAPSHOT_KEY), null); // nothing before the first save
  save(defaultState(), st); // e.g. an accidental reset
  const snap = JSON.parse(st.getItem(SNAPSHOT_KEY));
  assert.equal(snap.data.habits.length, 1);
  // A later empty save on the same day doesn't replace the good snapshot.
  save(defaultState(), st);
  assert.equal(JSON.parse(st.getItem(SNAPSHOT_KEY)).data.habits.length, 1);
});
