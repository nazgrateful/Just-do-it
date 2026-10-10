// Calendar export (.ics). Recurring alarms/habits use RRULE so one import covers every week.
import { ymd } from './util.js';

const BYDAY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

const escText = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const dt = (date, time) => `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;

function fold(line) {
  // RFC 5545: lines longer than 75 octets are folded (approximated by characters).
  const out = [];
  while (line.length > 74) {
    out.push(line.slice(0, 74));
    line = ' ' + line.slice(74);
  }
  out.push(line);
  return out.join('\r\n');
}

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number);
  const t = Math.min(23 * 60 + 59, h * 60 + m + mins);
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

function vevent({ uid, title, date, time, minutes = 15, days, notes, important }) {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${uid}@just-do-it`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')}`,
    `DTSTART:${dt(date, time)}`,
    `DTEND:${dt(date, addMinutes(time, minutes))}`,
    `SUMMARY:${escText((important ? '‼️ ' : '') + title)}`,
  ];
  if (days) lines.push(days.length && days.length < 7 ? `RRULE:FREQ=WEEKLY;BYDAY=${[...days].sort().map((d) => BYDAY[d]).join(',')}` : 'RRULE:FREQ=DAILY');
  if (notes) lines.push(`DESCRIPTION:${escText(notes)}`);
  if (important) lines.push('PRIORITY:1', 'CATEGORIES:IMPORTANT');
  lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escText(title)}`, 'TRIGGER:PT0M', 'END:VALARM');
  if (important) lines.push('BEGIN:VALARM', 'ACTION:AUDIO', 'TRIGGER:PT0M', 'END:VALARM', 'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escText(title)} (again)`, 'TRIGGER:PT2M', 'END:VALARM');
  lines.push('END:VEVENT');
  return lines.map(fold).join('\r\n');
}

/**
 * Build a calendar file. `what` picks which kinds to include.
 */
export function buildIcs(state, { alarms = true, habits = true, events = true, importantOnly = false, today = ymd() } = {}) {
  const out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Just Do It//Habits and skills//EN', 'CALSCALE:GREGORIAN', `X-WR-CALNAME:${importantOnly ? 'Just Do It — Important' : 'Just Do It'}`];
  if (alarms) {
    for (const a of state.alarms) {
      if (!a.enabled || (importantOnly && !a.important)) continue;
      out.push(vevent({ uid: `alarm-${a.id}`, title: a.label || 'Alarm', date: today, time: a.time, minutes: 5, days: a.days?.length ? a.days : [], important: a.important, notes: 'Alarm from Just Do It' }));
    }
  }
  if (habits && !importantOnly) {
    for (const h of state.habits) {
      if (!h.time) continue;
      out.push(vevent({ uid: `habit-${h.id}`, title: `${h.emoji || ''} ${h.name}`.trim(), date: today, time: h.time, minutes: 15, days: h.days?.length ? h.days : [], notes: h.notes }));
    }
  }
  if (events && !importantOnly) {
    for (const e of state.events) {
      if (e.date < today) continue;
      out.push(vevent({ uid: `event-${e.id}`, title: e.title, date: e.date, time: e.time || '09:00', minutes: e.minutes || 60, notes: e.notes }));
    }
  }
  out.push('END:VCALENDAR');
  return out.join('\r\n') + '\r\n';
}
