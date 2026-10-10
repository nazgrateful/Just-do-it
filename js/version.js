// Bump APP_VERSION (and package.json, and CACHE in sw.js) when publishing an update,
// and add a line to RELEASES so people see what changed.
export const APP_VERSION = '1.2.0';

export const RELEASES = [
  {
    version: '1.2.0',
    date: '2026-10-10',
    notes: [
      'Answer every question in your own words first; suggestions are tucked into a “💡 Show suggestions” panel you can open',
      'Easier-to-read text: more solid glass behind words, darker text, and a soft glow on text over the sky',
      'More Frutiger Aero sky details: soft clouds and bokeh light',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-10-10',
    notes: [
      'New Frutiger Aero look: glass panels, glossy buttons, sky, light rays and floating bubbles',
      'Frutiger Aero is now the default vibe; any other aesthetic you pick tints the glass',
    ],
  },
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
