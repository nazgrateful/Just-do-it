// Bump APP_VERSION (and package.json, and CACHE in sw.js) when publishing an update,
// and add a line to RELEASES so people see what changed.
export const APP_VERSION = '1.0.0';

export const RELEASES = [
  {
    version: '1.0.0',
    date: '2026-10-10',
    notes: [
      'Design-your-life questions: vibe, home & cleaning, exercise, body, food, routines, style, environment, relationships, skills',
      'Habit tracker with streaks, 100-skills-in-365-days challenge, 24-hour / week / month schedule',
      'Timer, focus mode and stopwatch that log practice to skills',
      'Custom alarms; important alarms can be sent to your phone’s Clock to break through Do Not Disturb',
      'Environment (everything you own) and People (boundaries) sections',
      'Backups you can save anywhere, and restore with undo',
    ],
  },
];
