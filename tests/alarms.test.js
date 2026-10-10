import test from 'node:test';
import assert from 'node:assert/strict';
import { nextOccurrence, dueAlarms, androidAlarmIntent, iosShortcutUrl, shortcutLines, detectPlatform } from '../js/alarmcore.js';
import { buildIcs } from '../js/ics.js';
import { defaultState } from '../js/store.js';

const al = (o) => ({ id: 'a', label: 'Wake up', time: '07:30', days: [], important: true, enabled: true, ...o });

test('next occurrence respects days', () => {
  const fri = new Date(2026, 9, 9, 8, 0); // Fri 9 Oct 2026, 08:00
  assert.equal(nextOccurrence(al(), fri).toString(), new Date(2026, 9, 10, 7, 30).toString());
  assert.equal(nextOccurrence(al({ days: [1] }), fri).toString(), new Date(2026, 9, 12, 7, 30).toString());
  assert.equal(nextOccurrence(al({ enabled: false }), fri), null);
});

test('due alarms fire once inside the window', () => {
  const a = al();
  const due = dueAlarms([a], new Date(2026, 9, 9, 7, 29, 55), new Date(2026, 9, 9, 7, 30, 0));
  assert.equal(due.length, 1);
  assert.equal(dueAlarms([a], new Date(2026, 9, 9, 7, 30, 0), new Date(2026, 9, 9, 7, 30, 5)).length, 0);
});

test('android intent sets hour, minutes and label', () => {
  const u = androidAlarmIntent(al({ label: 'Gym; go' }), 'https://x.test/#alarms');
  assert.match(u, /^intent:#Intent;action=android\.intent\.action\.SET_ALARM;/);
  assert.match(u, /i\.android\.intent\.extra\.alarm\.HOUR=7;/);
  assert.match(u, /i\.android\.intent\.extra\.alarm\.MINUTES=30;/);
  assert.match(u, /MESSAGE=Gym%3B%20go;/);
  assert.match(u, /S\.browser_fallback_url=https%3A%2F%2Fx\.test%2F%23alarms;end$/);
});

test('iOS shortcut link carries one line per alarm', () => {
  assert.equal(shortcutLines([al(), al({ time: '18:00', label: 'Gym', days: [1, 3] })]), '07:30|Wake up|Every day\n18:00|Gym|Mon Wed');
  assert.match(iosShortcutUrl([al()]), /^shortcuts:\/\/run-shortcut\?name=Just%20Do%20It%20Alarms&input=text&text=07%3A30%7CWake%20up/);
});

test('platform detection', () => {
  assert.equal(detectPlatform('Mozilla/5.0 (Linux; Android 14)'), 'android');
  assert.equal(detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'), 'ios');
});

test('calendar export: recurring alarms, important flag', () => {
  const s = defaultState();
  s.alarms = [al({ days: [1, 3, 5] }), al({ id: 'b', important: false, label: 'Normal' })];
  const ics = buildIcs(s, { today: '2026-10-10' });
  assert.match(ics, /RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR/);
  assert.match(ics, /RRULE:FREQ=DAILY/);
  assert.match(ics, /SUMMARY:‼️ Wake up/);
  const imp = buildIcs(s, { today: '2026-10-10', importantOnly: true });
  assert.doesNotMatch(imp, /Normal/);
});
