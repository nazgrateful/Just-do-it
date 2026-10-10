// Step-by-step guides for making important alarms break through Do Not Disturb.
import { SHORTCUT_NAME } from '../alarmcore.js';

const steps = (list) => `<ol class="steps">${list.map((s) => `<li>${s}</li>`).join('')}</ol>`;

export const WHY = `
  <p>A website is not allowed to switch off your phone's Do Not Disturb by itself. These are the
  workarounds, from the most reliable to the least. Pick the ones that fit you; doing <b>1</b> and <b>2</b> is plenty.</p>`;

export const IOS = `
  <h4>1. Send important alarms to the iPhone Clock app ⭐ most reliable</h4>
  <p class="small">Clock alarms always ring, even with Do Not Disturb, Focus or the silent switch on. This app can
  create them for you through a shortcut. Set it up once (about 2 minutes):</p>
  ${steps([
    'Open the <b>Shortcuts</b> app and tap <b>+</b> to make a new shortcut.',
    `Tap the name at the top and rename it to exactly <b>${SHORTCUT_NAME}</b>.`,
    'Add the action <b>Split Text</b>. Set it to split <b>Shortcut Input</b> by <b>New Lines</b>. (If it asks where input comes from, choose <b>Receive Text</b>, and for "If there\'s no input" choose <b>Ask For Text</b>.)',
    'Add <b>Repeat with Each</b> and set it to repeat with each item in <b>Split Text</b>.',
    'Inside the repeat, add <b>Split Text</b>: split <b>Repeat Item</b> by <b>Custom</b> and type <b>|</b> (the vertical bar).',
    'Add <b>Get Item from List</b> → <b>First Item</b> of that Split Text. This is the alarm time.',
    'Add another <b>Get Item from List</b> → <b>Item At Index 2</b> of the same Split Text. This is the label.',
    'Add <b>Create Alarm</b> (from the Clock app). Set <b>Time</b> to the first item and <b>Label</b> to the second item. If you see a <b>Repeat</b> option, you can set days there.',
    'Tap <b>Done</b>. Back in Just Do It, tap <b>Send to iPhone Clock</b> on the Alarms screen. The first time, iOS asks for permission: tap <b>Always Allow</b>.',
  ])}
  <p class="small muted">Each line the app sends looks like <code>07:30|Wake up|Mon Tue Wed</code>. iOS creates the alarm for the time;
  if your iPhone does not show a Repeat option in Create Alarm, open the Clock app once and set the repeat days.</p>

  <h4>2. Let Just Do It through your Focus</h4>
  ${steps([
    'Install the app: in <b>Safari</b> tap <b>Share → Add to Home Screen</b>, then open it from the home screen. (iPhone only allows notifications for installed web apps, iOS 16.4 or later.)',
    'In Just Do It, go to <b>Settings → Turn on notifications</b> and tap <b>Allow</b>.',
    'Open iPhone <b>Settings → Focus → Do Not Disturb → Apps → Add</b> and pick <b>Just Do It</b>. Repeat for any other Focus you use (Sleep, Work…).',
    'In <b>Settings → Notifications → Just Do It</b>, turn on <b>Sounds</b> and set banners to <b>Persistent</b>.',
  ])}

  <h4>3. Calendar back-up</h4>
  ${steps([
    'On the Alarms screen tap <b>Export important alarms (.ics)</b> and open the file. Add all events to a calendar.',
    'Allow the Calendar through Focus: <b>Settings → Focus → Do Not Disturb → Apps → Add → Calendar</b>.',
  ])}

  <h4>4. Night-stand mode</h4>
  <p class="small">Leave Just Do It open on the charger with <b>Alarm clock mode</b> on. The screen stays on and the app
  plays your alarm out loud through the speaker. On iOS 17+ the app plays through the silent switch.</p>`;

export const ANDROID = `
  <h4>1. Add important alarms to your phone's Clock ⭐ most reliable</h4>
  <p class="small">Clock alarms ring through Do Not Disturb by default. On the Alarms screen, tap <b>Add to Clock</b> next to an
  alarm: your Clock app opens with the time and name filled in. Tap <b>Save</b> / <b>✓</b>. The link can't pass repeat days, so
  set them in the Clock app (tap the alarm → choose days).</p>
  <p class="small muted">Check it is allowed: <b>Settings → Sound → Do Not Disturb → Alarms & other interruptions → Alarms</b> should be on (it is by default).</p>

  <h4>2. Let Just Do It override Do Not Disturb</h4>
  ${steps([
    'Install the app: in <b>Chrome</b> tap <b>⋮ → Install app</b> (or <b>Add to Home screen</b>) and open it from the home screen.',
    'In Just Do It, go to <b>Settings → Turn on notifications</b> and tap <b>Allow</b>.',
    'Open <b>Settings → Sound (or Notifications) → Do Not Disturb → Apps → Add apps</b> and pick <b>Just Do It</b> (or <b>Chrome</b> if it is not listed).',
    'Then <b>Settings → Apps → Just Do It → Notifications</b>: turn on <b>Override Do Not Disturb</b> / <b>Priority</b> if your phone shows it, and set sound to on.',
  ])}
  <p class="small muted">Menu names vary by brand (Samsung: Settings → Notifications → Do not disturb → App notifications).</p>

  <h4>3. Calendar back-up</h4>
  ${steps([
    'On the Alarms screen tap <b>Export important alarms (.ics)</b> and open it with Google Calendar (or your calendar app).',
    'Allow events through: <b>Do Not Disturb → Alarms & other interruptions → Events / Reminders</b> on.',
  ])}

  <h4>4. Night-stand mode</h4>
  <p class="small">Leave Just Do It open on the charger with <b>Alarm clock mode</b> on. The screen stays on and the app plays your
  alarm through the speaker — media sound is not muted by Do Not Disturb.</p>`;

export const DESKTOP = `
  <h4>Computer</h4>
  ${steps([
    'Allow notifications for this site when your browser asks (or in Settings here).',
    '<b>Mac:</b> System Settings → Focus → Do Not Disturb → Allowed Apps → add your browser.',
    '<b>Windows:</b> Settings → System → Notifications → Do not disturb → Set priority notifications → Add apps → your browser.',
    'Keep this tab open: the app rings out loud while it is open.',
  ])}`;

export function dndGuide(platform) {
  const sec = (id, title, body) => `<details class="group guide"${platform === id ? ' open' : ''}><summary><b>${title}</b>${platform === id ? ' <span class="pill">your device</span>' : ''}</summary>${body}</details>`;
  return WHY + sec('ios', '📱 iPhone / iPad', IOS) + sec('android', '🤖 Android', ANDROID) + sec('desktop', '💻 Computer', DESKTOP);
}
