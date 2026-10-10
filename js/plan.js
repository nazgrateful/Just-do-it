// Turns questionnaire answers into a starter plan: habits, skills, alarms and events.
// Pure functions (no DOM) so they can be tested in Node.
import { uid, ymd, addDays, weekday } from './util.js';
import { SKILL_LIBRARY, SECTIONS, SECTION_DOMAIN, DOMAINS } from './data.js';

const ALL = [0, 1, 2, 3, 4, 5, 6];

export const TIME_OF = {
  'Early morning': '06:00', Morning: '07:30', Lunch: '12:15', 'Lunch break': '12:30', Afternoon: '16:00',
  'After work': '17:30', Evening: '19:00', 'Weekend blocks': '10:00',
};

export function shiftTime(hhmm, minutes) {
  const [h, m] = hhmm.split(':').map(Number);
  const t = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

/** Hours like "6am", "6:30 pm", "18:00" typed in your own words → "HH:MM". */
export function parseTimeText(text) {
  const m = String(text || '').toLowerCase().match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] || 0);
  if (m[3]?.startsWith('p') && h < 12) h += 12;
  if (m[3]?.startsWith('a') && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}
const timeOf = (answer, fallback) => TIME_OF[answer] || parseTimeText(answer) || fallback;

/** "45 min", "1 hour", "1.5h" → minutes. */
export function minutesOf(text, fallback) {
  const s = String(text || '').toLowerCase();
  const n = parseFloat(s);
  if (!n) return fallback;
  return Math.round(/h(ou)?r|^\d+(\.\d+)?\s*h$/.test(s) && !/min/.test(s) ? n * 60 : n);
}

const CHORE_EMOJI = {
  'Make bed': '🛏️', Dishes: '🍽️', 'Kitchen wipe-down': '🧽', Laundry: '🧺', Bathroom: '🛁', Floors: '🧹', Dusting: '🪶',
  'Trash & recycling': '🗑️', 'Change sheets': '🛏️', 'Fridge clean-out': '🧊', 'Declutter one thing': '📦', 'Water plants': '🪴',
  'Windows & mirrors': '🪟', Car: '🚗',
};
const DAILY_CHORES = ['Make bed', 'Dishes', 'Kitchen wipe-down', 'Declutter one thing'];
const ZONES = [
  [1, 'Kitchen', ['Kitchen wipe-down', 'Fridge clean-out']],
  [2, 'Bathroom', ['Bathroom', 'Windows & mirrors']],
  [3, 'Floors & dusting', ['Floors', 'Dusting']],
  [4, 'Laundry', ['Laundry']],
  [5, 'Bedroom & sheets', ['Change sheets']],
  [6, 'Declutter & extras', ['Declutter one thing', 'Car', 'Trash & recycling']],
];

const WORKOUT_EMOJI = {
  'Strength / weights': '🏋️', Pilates: '🤍', Yoga: '🧘', Running: '🏃', Walking: '🚶', HIIT: '🔥', Calisthenics: '🤸', Cycling: '🚴',
  Swimming: '🏊', Dance: '💃', 'Boxing / martial arts': '🥊', Climbing: '🧗', Hiking: '🥾', 'Mobility & stretching': '🙆', 'Team sports': '⚽',
};

/** Habits that make more sense on particular days than every day. */
const WEEKLY = {
  'Meal prep on Sunday': [0], 'Budget review on Sunday': [0], 'Call family weekly': [0], 'See a friend weekly': [5], 'Date night': [5],
  'Weekly bath / reset night': [0], 'Haircare day': [3], Nails: [6], 'No-spend days': [1, 2, 3], 'Save every week': [5],
  Volunteer: [6], 'Meet new people': [4], 'Plan outfits': [0], 'Therapy / self check-in': [0], 'Family dinner': [0],
  'Weekly check-in talk': [0], 'Weekly worship or service': [0], 'Rest day each week': [0], 'Make something weekly': [6],
  'Movie night': [5], 'Go out weekly': [5], 'Weekly errands run': [6], 'Walk in nature weekly': [6], 'Sunday planning': [0],
  'Weekly reset': [0], 'Reward myself weekly': [0], 'Say no to one thing a week': [1], 'Review my priorities weekly': [0],
  'Weekly goals review': [0], 'Inbox zero weekly': [5], 'Clear phone photos weekly': [0], 'Weekly career review': [5],
  'Weekly planning': [0], 'Hot bath or sauna': [3], 'Games night': [5], 'Play a sport': [2, 6], 'Gardening': [6],
  'Show up for big moments': [], 'Keep our traditions': [],
};

/**
 * How often a habit happens, guessed from its wording:
 * { days } for daily/weekly habits, { monthly } or { once } for things that go on the calendar instead.
 */
export function cadence(name) {
  if (WEEKLY[name]) return WEEKLY[name].length ? { days: WEEKLY[name] } : { skip: true };
  const t = name.toLowerCase();
  if (/twice a year|every 6 months|every 2 years|yearly|annual/.test(t)) return { once: true };
  if (/monthly|every month/.test(t)) return { monthly: true };
  if (/weekly|each week|a week|sunday/.test(t)) return { days: [0] };
  if (/weekend/.test(t)) return { days: [0, 6] };
  return { days: ALL };
}

const HABIT_EMOJI = {
  'Drink 2 L of water': '💧', 'A vegetable with every meal': '🥦', 'Cook at home': '🍲', 'Meal prep on Sunday': '🥡', 'Protein at breakfast': '🍳',
  'Less sugar': '🍬', 'No eating after 8pm': '🌙', 'Take vitamins': '💊', 'Less caffeine': '☕', 'No caffeine after 2pm': '☕', 'Less alcohol': '🍷',
  'Glass of water': '💧', Stretch: '🙆', Meditate: '🧘', Journal: '📓', 'Read 10 pages': '📖', Skincare: '🧴', 'Sunlight walk': '☀️',
  'No phone for the first hour': '📵', 'Cold shower': '🚿', 'Plan the day': '🗒️', '10-minute tidy-up': '🧹', "Lay out tomorrow's clothes": '👕',
  Read: '📖', 'Gratitude list': '🙏', 'No screens 1h before bed': '📵', 'Plan tomorrow': '🗒️', 'Read daily': '📖', 'Limit social media': '📱',
  Gratitude: '🙏', 'Time outdoors': '🌳', 'Morning sunlight': '☀️', 'Track spending': '💸', 'Save every week': '🏦',
  'Skincare routine': '🧴', Floss: '🦷', 'Posture check': '🧍', 'Walk 8,000 steps': '🚶', Prayer: '🕊️', 'Review my day': '🌙',
  'Take medication on time': '💊', 'Breathing exercise': '🌬️', 'Dim the lights': '🕯️', 'Herbal tea': '🍵', 'Daily affection': '🤍',
  'Message a friend': '💬', 'Call family weekly': '📞', 'Date night': '🥂', 'Kindness to a stranger': '😊', 'Help one person a day': '🤝',
  'Top 3 priorities': '🎯', 'Deep-work block': '🧠', 'Mood check-in': '🌡️', 'Name my feelings': '💭', 'Kind self-talk': '💗',
  'Laugh every day': '😄', 'Celebrate small wins': '🎉', 'Never miss twice': '🔁', 'Hardest thing first': '🐸',
};
const DOMAIN_EMOJI = Object.fromEntries(DOMAINS.map((d) => [d.name, d.emoji]));

function habit(name, area, sub, { days = ALL, time = '', emoji = '', notes = '' } = {}) {
  return { id: uid(), name, area, sub, emoji: emoji || HABIT_EMOJI[name] || DOMAIN_EMOJI[area] || '✅', days: [...days], time, notes, createdAt: ymd() };
}

function alarm(label, time, days, choice, link) {
  if (!choice || choice === 'No alarm') return null;
  return { id: uid(), label, time, days: [...days], important: choice.startsWith('Important'), enabled: true, link: link || null };
}

/** The first `weekday` of each of the next 12 months, from today. */
function monthlyDates(today, wd = 0) {
  const out = [];
  for (let m = 0; m < 12; m++) {
    let s = ymd(new Date(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1 + m, 1));
    while (weekday(s) !== wd) s = addDays(s, 1);
    if (s >= today) out.push(s);
  }
  return out;
}

/** Infer which library category a skill belongs to. */
export function categoryOf(name) {
  for (const [cat, list] of Object.entries(SKILL_LIBRARY)) if (list.includes(name)) return cat;
  return 'Other';
}

export function makeSkill(name, category = categoryOf(name), extra = {}) {
  return { id: uid(), name, category, status: 'todo', minutes: 0, milestone: `I can ${name.charAt(0).toLowerCase()}${name.slice(1)} without help.`, notes: '', addedAt: ymd(), learnedAt: null, ...extra };
}

export function buildPlan(a, today = ymd()) {
  const habits = [];
  const alarms = [];
  const events = [];
  const event = (title, date, area, sub, extra = {}) => events.push({ id: uid(), title, date, time: '09:00', minutes: 60, area, sub, notes: '', ...extra });

  // --- Body · Sleep -------------------------------------------------------------
  const wake = a.wake || '06:30';
  const bed = a.bed || '22:30';
  if (a.naps === 'Power nap (20 min)') habits.push(habit('Power nap · 20 min', 'Body', 'Sleep', { time: '14:00', emoji: '😴' }));

  // --- Body · Movement ------------------------------------------------------------
  const fitDays = a.fitDays?.length ? [...a.fitDays].sort() : [];
  const fitTime = timeOf(a.fitTime, '07:30');
  const fitLen = minutesOf(a.fitLength, 30);
  const types = a.workouts?.length ? a.workouts : ['Workout'];
  const byType = new Map();
  fitDays.forEach((d, i) => {
    const t = types[i % types.length];
    byType.set(t, [...(byType.get(t) || []), d]);
  });
  for (const [t, days] of byType) {
    habits.push(habit(`${t} · ${fitLen} min`, 'Body', 'Movement', { days, time: fitTime, emoji: WORKOUT_EMOJI[t] || '💪', notes: [a.where && `Where: ${a.where}`, a.level && `Level: ${a.level}`].filter(Boolean).join(' · ') }));
  }
  const flex = (a.abilities || []).some((x) => /toes|splits|handstand|cartwheel/i.test(x));
  if (flex && !(a.workouts || []).includes('Mobility & stretching')) habits.push(habit('Mobility · 10 min', 'Body', 'Movement', { emoji: '🙆' }));

  // --- Every "habit" question: each answer becomes a habit in its domain and area ---
  const timeFor = { Sleep: shiftTime(bed, -60) };
  for (const sec of SECTIONS) {
    const domain = SECTION_DOMAIN[sec.id];
    for (const q of sec.questions) {
      if (!q.habit) continue;
      for (const name of a[q.id] || []) {
        const c = cadence(name);
        if (c.skip) continue;
        if (c.monthly) monthlyDates(today).forEach((d) => event(name, d, domain, q.area));
        else if (c.once) event(`Book: ${name}`, addDays(today, 14), domain, q.area);
        else habits.push(habit(name, domain, q.area, { days: c.days, time: timeFor[q.area] || '' }));
      }
    }
  }
  // Answers saved by older versions of the questions.
  for (const h of a.money || []) if (h !== 'Learn about investing') habits.push(habit(h, 'Money', 'Spending', { days: cadence(h).days || [0] }));
  for (const h of a.people || []) habits.push(habit(h, 'Relationships', 'Friends', { days: cadence(h).days || [0], emoji: '💬' }));

  // --- Self-management · Time: morning and evening routines ------------------------
  for (const h of a.morning || []) habits.push(habit(h, 'Self-management', 'Time', { time: wake }));
  for (const h of a.evening || []) habits.push(habit(h, 'Self-management', 'Time', { time: shiftTime(bed, -60) }));

  // --- Environment · Home & cleaning ----------------------------------------------
  const E = 'Environment';
  const HC = 'Home & cleaning';
  const chores = a.chores || [];
  const cleanTime = timeOf(a.cleanTime, '18:00');
  const cleanDays = a.cleanDays?.length ? a.cleanDays : [6];
  const kitNote = [a.products?.length ? `Use: ${a.products.join(', ')}` : '', a.scent ? `Scent: ${a.scent}` : '', a.tools?.length ? `Tools: ${a.tools.join(', ')}` : ''].filter(Boolean).join(' · ');
  const daily = chores.filter((c) => DAILY_CHORES.includes(c));
  const weekly = chores.filter((c) => !DAILY_CHORES.includes(c));

  if (a.cleanStyle === 'One zone per day') {
    for (const c of daily) habits.push(habit(c, E, HC, { emoji: CHORE_EMOJI[c], notes: kitNote }));
    for (const [day, zone, zoneChores] of ZONES) {
      const included = zoneChores.filter((c) => weekly.includes(c));
      if (!included.length && !['Kitchen', 'Bathroom', 'Floors & dusting'].includes(zone)) continue;
      habits.push(habit(`Zone: ${zone}`, E, HC, { days: [day], time: cleanTime, emoji: '🧽', notes: [included.join(', '), kitNote].filter(Boolean).join(' · ') }));
    }
  } else if (a.cleanStyle === '15-minute daily reset') {
    habits.push(habit('15-minute home reset', E, HC, { time: cleanTime, emoji: '⏲️', notes: [daily.join(', ') || 'Tidy, wipe, put away', kitNote].filter(Boolean).join(' · ') }));
    if (weekly.length) habits.push(habit(`Weekly clean: ${weekly.join(', ')}`, E, HC, { days: cleanDays, time: cleanTime, emoji: '🧽', notes: kitNote }));
  } else {
    for (const c of daily) habits.push(habit(c, E, HC, { emoji: CHORE_EMOJI[c], notes: kitNote }));
    if (weekly.length || a.cleanStyle === 'One big weekly clean') {
      habits.push(habit(`Big clean${weekly.length ? ': ' + weekly.join(', ') : ''}`, E, HC, { days: cleanDays, time: cleanTime, emoji: '🧽', notes: kitNote }));
    }
  }
  if (a.cleanStyle === 'Little bits as I go + monthly deep clean') {
    monthlyDates(today, cleanDays[0]).forEach((d) => event('Monthly deep clean', d, E, HC, { time: cleanTime, minutes: 120, notes: kitNote }));
  }

  // --- Work & purpose · Skills --------------------------------------------------------
  const learnMin = minutesOf(a.dailyMinutes, 30);
  const learnTime = timeOf(a.learnTime, '19:00');
  const learnDays = a.learnTime === 'Weekend blocks' ? [0, 6] : ALL;
  habits.push(habit(`Practise a skill · ${learnMin} min`, 'Work & purpose', 'Skills', { days: learnDays, time: learnTime, emoji: '🎯' }));

  const names = new Set(a.skillPicks || []);
  for (const ab of a.abilities || []) names.add(ab);
  if ([...(a.money || []), ...(a.growing || [])].includes('Learn about investing')) names.add('Understand index-fund investing');
  const skills = [...names].map((n) => makeSkill(n, (a.abilities || []).includes(n) ? 'Body & movement' : categoryOf(n)));

  // --- Self-management · Alarms ---------------------------------------------------------
  alarms.push(
    ...[
      alarm('Wake up — just do it', wake, ALL, a.alarmWake),
      fitDays.length ? alarm('Workout time', shiftTime(fitTime, -15), fitDays, a.alarmWorkout) : null,
      alarm(`Skill practice (${learnMin} min)`, learnTime, learnDays, a.alarmLearn),
      alarm('Wind down for bed', shiftTime(bed, -45), ALL, a.alarmBed),
    ].filter(Boolean),
  );

  // --- Relationships: one card per kind of relationship, ready to personalise ---------
  const people = (a.relTypes || []).map((rel) => ({
    id: uid(), name: rel, relation: rel,
    behave: (a.relBehave || []).join(', '),
    treated: (a.relTreated || []).join(', '),
    boundaries: (a.relBoundaries || []).join('\n'),
    contact: '', notes: '',
  }));

  // Same habit picked in two places (e.g. "Stretch" morning and at bedtime): keep the first.
  const seen = new Set();
  const unique = habits.filter((h) => {
    const k = h.name.toLowerCase();
    return !seen.has(k) && seen.add(k);
  });

  return { habits: unique, skills, alarms, events, people };
}
