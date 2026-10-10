// Small helpers shared by every screen. No DOM access here except `esc`/`$`.

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const pad = (n) => String(n).padStart(2, '0');

/** Local calendar date as 'YYYY-MM-DD'. */
export function ymd(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Parse 'YYYY-MM-DD' as local midnight. */
export function parseYmd(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s, n) {
  const d = parseYmd(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
}

/** Whole days from a to b (both 'YYYY-MM-DD'); DST-safe. */
export function daysBetween(a, b) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

export const weekday = (s) => parseYmd(s).getDay();

export function fmtTime(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const ap = h >= 12 ? 'pm' : 'am';
  return `${((h + 11) % 12) + 1}:${pad(m)}${ap}`;
}

export function fmtDuration(totalSec) {
  totalSec = Math.max(0, Math.round(totalSec));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function fmtMinutes(min) {
  min = Math.round(min);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  return min % 60 ? `${h}h ${min % 60}m` : `${h}h`;
}

export function fmtDate(s, opts = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return parseYmd(s).toLocaleDateString(undefined, opts);
}

export function daysLabel(days) {
  if (!days || !days.length || days.length === 7) return 'Every day';
  const set = [...days].sort().join();
  if (set === '1,2,3,4,5') return 'Weekdays';
  if (set === '0,6') return 'Weekends';
  return [...days].sort().map((d) => DAY_NAMES[d]).join(' ');
}

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
