// Bump APP_VERSION (and package.json, and CACHE in sw.js) when publishing an update,
// and add a line to RELEASES so people see what changed.
export const APP_VERSION = '1.6.0';

export const RELEASES = [
  {
    version: '1.6.0',
    date: '2026-10-10',
    notes: [
      'New Tranquil serenity look (now the default): matte linen and sand, sage and misty blue, soft mist drifting over distant hills',
      'Elegant serif headings (Cormorant Garamond) over a soft humanist sans, more space, quieter controls and slow, gentle motion',
      'Frutiger Aero is still there: pick it under Meaning → Identity → Show aesthetic ideas',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-10-10',
    notes: [
      'Reorganised around the map of a life: Body, Mind, Meaning (soul) first, then Relationships, Work & purpose, Money, Environment (cleaning lives here), Play & rest, Self-management',
      'Each step of the questions covers one life area, with headings for its parts (e.g. Body → Sleep, Food, Movement, Grooming, Medical care, Recovery)',
      'New questions for attention, emotions, thinking, values, faith, reflection, family, partner, friends, community, career, money, digital space, life admin, play and discipline',
      'Today and Habits are sorted in the same order; new Life map tab shows life area → part → your habits',
      'Monthly and yearly things (like check-ups or visiting family) go on your calendar instead of the daily list',
      'Your existing habits were moved into the new areas automatically; nothing was removed',
    ],
  },
  {
    version: '1.4.0',
    date: '2026-10-10',
    notes: [
      'The timer now rings even when your screen is off, with a Stop button on the lock screen',
      'Night-stand mode arms your next alarm so it rings through Do Not Disturb and a locked screen',
      'New iPhone options in the Do Not Disturb guide: turn Focus off automatically at alarm time, and Time Sensitive Calendar/Reminders alerts',
      'Android: “Also set it in my Clock app” button for the timer',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-10-10',
    notes: [
      'Frutiger Aero lettering: a Frutiger-style humanist font (bundled, works offline) and glossy glass-gradient titles, wordmark and big numbers',
    ],
  },
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
