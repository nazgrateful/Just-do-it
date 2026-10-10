import test from 'node:test';
import assert from 'node:assert/strict';
import { makeBackup, parseBackup } from '../js/backup.js';
import { defaultState } from '../js/store.js';

test('backup round-trips all data', () => {
  const s = defaultState('2026-01-01');
  s.habits = [{ id: 'h', name: 'Walk', days: [1] }];
  s.inventory = [{ id: 'i', name: 'Lamp' }];
  s.people = [{ id: 'p', name: 'Mom', boundaries: 'Call first' }];
  s.log = { '2026-01-02': { h: true } };
  const back = parseBackup(makeBackup(s));
  assert.deepEqual(back, s);
});

test('raw saved data is accepted as a backup', () => {
  const s = defaultState();
  s.skills = [{ id: 'x' }];
  assert.equal(parseBackup(JSON.stringify(s)).skills.length, 1);
});

test('non-backups are rejected with a friendly message', () => {
  assert.throws(() => parseBackup('hello'), /isn't a Just Do It backup/);
  assert.throws(() => parseBackup('{"foo":1}'), /doesn't contain/);
});
