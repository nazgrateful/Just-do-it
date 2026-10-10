import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPlan, shiftTime } from '../js/plan.js';

const answers = {
  aesthetic: 'japandi',
  cleanStyle: 'One zone per day', chores: ['Make bed', 'Bathroom', 'Floors'], products: ['Natural DIY (vinegar, baking soda, castile soap)'], cleanTime: 'Evening',
  fitDays: [1, 3, 5], fitTime: 'Morning', fitLength: '45 min', workouts: ['Pilates', 'Running'],
  abilities: ['Do 1 pull-up', 'Full splits'],
  wake: '06:00', bed: '22:00', morning: ['Glass of water'],
  skillPicks: ['Bake sourdough bread', 'My own skill'], dailyMinutes: '30 min', learnTime: 'Evening',
  relTypes: ['Parents'], relBoundaries: ['No yelling', 'Visits need notice'],
  alarmWake: 'Important (breaks through Do Not Disturb)', alarmWorkout: 'Normal reminder', alarmLearn: 'No alarm', alarmBed: 'No alarm',
};

test('plan builds habits, skills, alarms and people from answers', () => {
  const p = buildPlan(answers, '2026-10-10');
  const names = p.habits.map((h) => h.name);
  assert.ok(names.includes('Make bed'));
  assert.ok(names.some((n) => n.startsWith('Zone: Bathroom')));
  assert.ok(names.includes('Pilates · 45 min'));
  assert.deepEqual(p.habits.find((h) => h.name === 'Pilates · 45 min').days, [1, 5]);
  assert.deepEqual(p.habits.find((h) => h.name === 'Running · 45 min').days, [3]);
  assert.ok(names.includes('Mobility · 10 min'), 'flexibility goals add mobility');
  assert.ok(names.includes('Practise a skill · 30 min'));

  const skills = p.skills.map((s) => [s.name, s.category]);
  assert.deepEqual(skills.find((s) => s[0] === 'Bake sourdough bread'), ['Bake sourdough bread', 'Kitchen & food']);
  assert.deepEqual(skills.find((s) => s[0] === 'Do 1 pull-up'), ['Do 1 pull-up', 'Body & movement']);
  assert.deepEqual(skills.find((s) => s[0] === 'My own skill'), ['My own skill', 'Other']);

  assert.equal(p.alarms.length, 2);
  assert.equal(p.alarms[0].important, true);
  assert.equal(p.alarms[0].time, '06:00');
  assert.equal(p.alarms[1].important, false);
  assert.equal(p.alarms[1].time, '07:15');

  assert.equal(p.people[0].relation, 'Parents');
  assert.equal(p.people[0].boundaries, 'No yelling\nVisits need notice');
});

test('shiftTime wraps around midnight', () => {
  assert.equal(shiftTime('00:10', -30), '23:40');
  assert.equal(shiftTime('23:50', 20), '00:10');
});

test('empty answers still give a valid plan', () => {
  const p = buildPlan({}, '2026-10-10');
  assert.ok(Array.isArray(p.habits) && Array.isArray(p.skills));
});
