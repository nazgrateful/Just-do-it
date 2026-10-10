// Backup files: a plain JSON file you can keep anywhere (Files, iCloud, Google Drive, email).
import { migrate, hasContent } from './store.js';
import { APP_VERSION } from './version.js';

export const BACKUP_TAG = 'just-do-it-backup';

export function makeBackup(state, now = new Date()) {
  return JSON.stringify({ type: BACKUP_TAG, appVersion: APP_VERSION, exportedAt: now.toISOString(), data: state }, null, 1);
}

export function backupName(now = new Date()) {
  return `just-do-it-backup-${now.toISOString().slice(0, 10)}.json`;
}

/** Read a backup (file contents or pasted text). Throws a friendly Error if it isn't one. */
export function parseBackup(text) {
  let obj;
  try {
    obj = JSON.parse(String(text).trim());
  } catch {
    throw new Error("This isn't a Just Do It backup (it isn't readable data).");
  }
  // Accept a wrapped backup or the raw saved data.
  const data = obj?.type === BACKUP_TAG ? obj.data : obj;
  if (!data || typeof data !== 'object' || (!('habits' in data) && !('skills' in data) && !('answers' in data))) {
    throw new Error("This file doesn't contain Just Do It data.");
  }
  return migrate(data);
}

export function summary(s) {
  const learned = s.skills.filter((x) => x.status === 'learned').length;
  return `${s.habits.length} habits, ${s.skills.length} skills (${learned} learned), ${s.alarms.length} alarms, ${s.events.length} plans, ${s.inventory.length} things, ${s.people.length} people, ${Object.keys(s.log).length} days of check-ins`;
}

export { hasContent };
