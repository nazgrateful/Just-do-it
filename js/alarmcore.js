// Alarm scheduling math and "send this alarm to the phone's own Clock app" links.
// Pure functions only, so they can be unit-tested.
import { DAY_NAMES } from './util.js';

export const SHORTCUT_NAME = 'Just Do It Alarms';

/** Next Date (>= from) this alarm should ring, or null if disabled / a one-off already past. */
export function nextOccurrence(alarm, from = new Date()) {
  if (!alarm.enabled) return null;
  const [h, m] = alarm.time.split(':').map(Number);
  for (let i = 0; i < 8; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i, h, m, 0, 0);
    if (d < from) continue;
    if (!alarm.days?.length || alarm.days.includes(d.getDay())) return d;
  }
  return null;
}

/** Alarms whose ring time fell in (since, now]; used by the in-app ringer. */
export function dueAlarms(alarms, since, now) {
  const out = [];
  for (const a of alarms) {
    const at = nextOccurrence(a, new Date(since.getTime() + 1));
    if (at && at <= now) out.push({ alarm: a, at });
  }
  return out;
}

/**
 * Android: an intent link that asks the phone's Clock app to create this alarm
 * (AlarmClock.ACTION_SET_ALARM). Clock alarms ring through Do Not Disturb by default.
 * If no app handles it, the browser goes to `fallback` instead.
 */
export function androidAlarmIntent(alarm, fallback) {
  const [h, m] = alarm.time.split(':').map(Number);
  const msg = encodeURIComponent(alarm.label || 'Alarm').replace(/;/g, '%3B');
  return (
    'intent:#Intent;action=android.intent.action.SET_ALARM;' +
    `i.android.intent.extra.alarm.HOUR=${h};i.android.intent.extra.alarm.MINUTES=${m};` +
    `S.android.intent.extra.alarm.MESSAGE=${msg};B.android.intent.extra.alarm.SKIP_UI=false;` +
    (fallback ? `S.browser_fallback_url=${encodeURIComponent(fallback)};` : '') +
    'end'
  );
}

/** One line per alarm: "07:30|Wake up|Mon Tue Wed" (days blank = every day). */
export function shortcutLines(alarms) {
  return alarms
    .map((a) => {
      const label = (a.label || 'Alarm').replace(/[|\n]/g, ' ');
      const days = a.days?.length && a.days.length < 7 ? [...a.days].sort().map((d) => DAY_NAMES[d]).join(' ') : 'Every day';
      return `${a.time}|${label}|${days}`;
    })
    .join('\n');
}

/** iPhone: runs the user's "Just Do It Alarms" shortcut, which creates Clock alarms. */
export function iosShortcutUrl(alarms) {
  return `shortcuts://run-shortcut?name=${encodeURIComponent(SHORTCUT_NAME)}&input=text&text=${encodeURIComponent(shortcutLines(alarms))}`;
}

export function detectPlatform(ua = globalThis.navigator?.userAgent || '') {
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && globalThis.navigator?.maxTouchPoints > 1)) return 'ios';
  return 'desktop';
}
