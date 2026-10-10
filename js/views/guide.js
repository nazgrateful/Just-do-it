// Step-by-step guides for making important alarms break through Do Not Disturb.
import { SHORTCUT_NAME } from '../alarmcore.js';

const steps = (list) => `<ol class="steps">${list.map((s) => `<li>${s}</li>`).join('')}</ol>`;

export const WHY = `
  <p>A website is not allowed to switch off your phone's Do Not Disturb by itself. These are the
  workarounds, from the most reliable to the least. Pick the ones that fit you; doing <b>1</b> and <b>2</b> is plenty.</p>`;

export const IOS = `
  <p class="small">An iPhone lets four things through Do Not Disturb: <b>Clock alarms</b>, <b>sound that is already playing</b>,
  <b>apps and people you allow</b>, and <b>Time Sensitive</b> alerts. Each option below uses one of them.
  Options 1 and 2 are the most reliable. Option 3 is a good back-up.</p>

  <h4>1. Send important alarms to the iPhone Clock app ⭐</h4>
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
  <p class="small muted">Each line the app sends looks like <code>07:30|Wake up|Mon Tue Wed</code>. If your iPhone doesn't show a Repeat
  option in Create Alarm, open the Clock app once and set the repeat days.</p>

  <h4>2. Night-stand mode: sound that's already playing ⭐</h4>
  <p class="small">Do Not Disturb silences <i>new</i> notifications, not audio that is already playing. On the Alarms screen tap
  <b>🌙 Night-stand mode</b> before bed. The app starts a silent track that turns into your alarm at the right time, so it rings
  through Do Not Disturb, the silent switch (iOS 17+) and a locked screen. The <b>timer</b> works the same way.</p>
  ${steps([
    'Turn the volume up with the side buttons (media volume, not the ringer).',
    'Tap <b>Night-stand mode</b> and leave the app open. You can lock the phone, but don\'t swipe the app away.',
    'Keep the phone on the charger. Low Power Mode is fine.',
    'You will see “Rings at …” on the lock screen. Tap ⏸ there to cancel.',
  ])}

  <h4>3. Turn Do Not Disturb off automatically at alarm time</h4>
  <p class="small">A Shortcuts automation can switch Focus off by itself and turn the volume up. Make one per alarm time:</p>
  ${steps([
    'Open <b>Shortcuts → Automation → +</b> (New Automation) → <b>Time of Day</b>.',
    'Set the time to your alarm time, choose <b>Daily</b> (or the days you want), and pick <b>Run Immediately</b>. Turn off <b>Notify When Run</b>.',
    'Tap <b>New Blank Automation</b> and add <b>Set Focus</b>: <b>Turn Do Not Disturb Off</b>. (Add another Set Focus for Sleep if you use it.)',
    'Add <b>Set Volume</b> → 100%.',
    'Optional: add <b>Play Sound</b> or <b>Open URLs</b> with this app\'s address followed by <code>#alarms</code>.',
    'Tap <b>Done</b>. At that time each day, Do Not Disturb turns off and normal alerts can ring again.',
  ])}
  <p class="small muted">Test it once with a time two minutes from now. Some actions can't run while the phone is locked on older iOS versions.</p>

  <h4>4. Let Just Do It and Time Sensitive alerts through your Focus</h4>
  ${steps([
    'Install the app: in <b>Safari</b> tap <b>Share → Add to Home Screen</b>, then open it from the home screen. (iPhone only allows notifications for installed web apps, iOS 16.4 or later.)',
    'In Just Do It, go to <b>Settings → Turn on notifications</b> and tap <b>Allow</b>.',
    'Open iPhone <b>Settings → Focus → Do Not Disturb</b>. Under <b>Allow Notifications → Apps</b>, add <b>Just Do It</b>, <b>Calendar</b> and <b>Reminders</b>. Turn on <b>Time Sensitive Notifications</b>.',
    'Open <b>Settings → Notifications → Calendar</b> (and <b>Reminders</b>) and turn on <b>Time Sensitive Notifications</b>. Timed Calendar and Reminders alerts can then break through.',
    'On the Alarms screen tap <b>Export important alarms (.ics)</b> and add the events to your calendar. Each one has an alert at the alarm time.',
    'Repeat the Focus steps for any other Focus you use (Sleep, Work…).',
  ])}

  <h4>Coming later: a real alarm app</h4>
  <p class="small muted">Since iOS 26, Apple's AlarmKit lets App Store apps ring exactly like the Clock app, through Silent and Focus.
  That needs Just Do It packaged as a native app (for example with Capacitor) and published through the App Store.
  The web version can't use it.</p>`;

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
  <p class="small">Tap <b>🌙 Night-stand mode</b> before bed and leave the app open (you can lock the phone). It starts a silent
  track that turns into your alarm, and Do Not Disturb doesn't mute sound that is already playing. The timer works the same way.</p>`;

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
