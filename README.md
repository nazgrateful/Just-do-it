# Just-Do-It: design your life, build habits, learn 100 skills in 365 days

A free, private, installable web app. No account, no ads, and nothing leaves your phone. It works offline after the first visit.

## What's inside

| | |
|---|---|
| 🫧 **Frutiger Aero look** | Glass panels, glossy aqua buttons, a sky background with clouds, bokeh, light rays, a green horizon and floating bubbles, in both light and dark mode. Text sits on near-solid glass with a soft glow, and was checked against WCAG AA contrast. **Lettering:** a Frutiger-style humanist sans (Source Sans 3, bundled under the SIL Open Font License, or real Frutiger / Segoe UI when installed). Titles, the wordmark and big numbers use glossy, Vista-style glass-gradient lettering. It is the default vibe. Any other aesthetic you pick (cozy, dark academia, coastal…) tints the glass. |
| 🗺 **The map of a life** | Everything is organised as **life area → part → daily habits**, in priority order: **body, mind and soul first**, then relationships, then the rest. **1 Body:** sleep, food, movement, hygiene & grooming, medical care, recovery. **2 Mind:** attention, emotions, thinking, learning, mental rest. **3 Meaning (soul):** identity & vibe, values, faith & philosophy, reflection. **4 Relationships:** family, partner, friends, community, communication & boundaries. **5 Work & purpose:** career, skills (the 100-skill challenge), productivity, creative work, contribution. **6 Money:** earning, spending, saving, growing, protecting. **7 Environment:** where you live, **home & cleaning**, belongings, digital space, life admin, surroundings. **8 Play & rest:** hobbies, entertainment, adventure, celebration. **9 Self-management:** time & routines, discipline, habit mechanics, choices, alarms. |
| ✨ **Design-your-life questions** | One step per life area, with headings for each part. You answer every question **in your own words first**, and ready-made ideas sit in a **💡 Show suggestions** panel under each question. Every habit the app creates is filed under its area and part. Monthly and yearly things (visiting family, check-ups) go on the calendar instead of the daily list. |
| 🧩 **Your plan, built for you** | Your answers become habits: a cleaning schedule (zone-per-day, daily reset, weekly or monthly deep clean), workouts spread over your chosen days, routines, a daily practice block, alarms and relationship cards. |
| ✓ **Habit tracker** | Daily checklist, streaks and best streaks, and a 12-week heatmap for every habit. |
| 🎯 **100 skills in 365 days** | Skills are grouped by area so related skills sit together, and each group has its own progress. Each skill can link to the skills it **builds on**. A pace line shows whether you're on track, and you can log practice time. Over 140 skill ideas are included. |
| 📅 **My schedule** | A **24-hour** day view, a **week** view and a **month** view. Habits, alarms, plans and learned skills appear in one place. Export everything to your phone's calendar (.ics) with weekly repeats. |
| ⏱ **Timer** | Countdown, focus mode (25/5) and stopwatch. It **rings even with the screen off**: Start begins one MP3 track that is silent for the countdown and then rings, and phones keep playing audio while asleep. It shows a lock-screen card with Stop. On Android, it can also set the same timer in the Clock app. It logs minutes to a skill. |
| ⏰ **Custom alarms** | Pick the time, days and label. **Important** alarms ring louder, flash, vibrate and keep ringing until you dismiss them. They can be sent to the phone's **own Clock app** so they break through Do Not Disturb (see below). Also includes snooze and an alarm-clock (night-stand) mode. |
| 🏡 **Environment** | How and where you want to live, plus a room-by-room list of **everything you own**. Mark each thing love it, use it, maybe, let go, or want to buy. |
| 💞 **People** | Every relationship in your life: how you want to show up, how you want to be treated, and your **boundaries**. You can also turn "how often I want to connect" into a habit. |
| 💾 **Your data is safe** | See below. |

## Important alarms and Do Not Disturb

A website isn't allowed to switch off Do Not Disturb by itself, so the app uses the phone's own alarm clock. Clock alarms always ring through Do Not Disturb.

- **Android:** each important alarm has an **Add to Clock** button. It opens the Clock app with the time and label filled in (`AlarmClock.ACTION_SET_ALARM`). Tap Save, then set the repeat days in Clock.
- **iPhone:** tap **Send to iPhone Clock**. This runs a shortcut called "Just Do It Alarms", which creates the Clock alarms. The app has the 2-minute, one-time setup steps.
- **Night-stand mode (iPhone and Android, no setup):** at bedtime, a silent track starts and turns into your next alarm. Do Not Disturb doesn't mute audio that is already playing, so it rings through Focus and a locked screen.
- **iPhone extras:** a Shortcuts automation that turns Do Not Disturb off at alarm time, and Time Sensitive Calendar/Reminders alerts. Native AlarmKit (iOS 26) would need an App Store build.
- **Also included:**
  - step-by-step guides for letting the app through Focus / Do Not Disturb
  - a calendar export of important alarms
  - copy-as-text
  - alarm-clock mode, which keeps the screen on and rings out loud while the app is open

  Find them on **Alarms** and in **Settings**.

## Your data is safe, including when the app is updated

- Everything is stored only on your device.
- **Updates never erase data.** A new version only *adds* missing fields, and it keeps an untouched copy of the old data first (`just-do-it-v1.backup-v<n>`). Unreadable data is copied aside, never overwritten.
- **Automatic daily safety copy.** Each day, the data from before your first change is kept on the device. A reset or a bad import can be rolled back from Settings.
- **Backups:**
  - **Save backup** opens the share sheet (Save to Files, iCloud Drive, Google Drive, email) or downloads a `.json` file.
  - **Copy as text** works anywhere.
  - **Restore** works from a file or pasted text. It shows what is in the backup, asks first, and can be **undone**.
- The app asks for a backup every 7 days (you can change this). After an update, it shows a "your data was kept" message.
- Updates wait for you: a bar says **"A new version is ready. Your data stays on this phone."** and nothing changes until you tap **Update**.

To publish an update: bump `APP_VERSION` in `js/version.js`, `version` in `package.json` and `CACHE` in `sw.js`, then add notes to `RELEASES`.

## Run it

You don't need to build anything. It's plain HTML, CSS and JavaScript modules.

```bash
npm start      # http://localhost:8080
npm test       # unit tests (Node 18+)
```

**Publish for free:** go to GitHub **Settings → Pages → Deploy from a branch → `main` / root**. Open the link on your phone and choose **Add to Home Screen** (iPhone, from Safari) or **Install app** (Android, from Chrome).

## Files

```
index.html, css/styles.css, sw.js, manifest.webmanifest, icons/, fonts/ (Source Sans 3 + licence)
js/app.js        router, theme, update flow
js/data.js       questions, aesthetics, skill library, cleaning kits
js/plan.js       answers → habits, skills, alarms, events, people
js/store.js      saving, upgrades, safety copies, streaks, challenge pace
js/backup.js     backup files
js/alarmcore.js  alarm times, Android Clock intent, iPhone Shortcut link
js/ring.js       in-app alarm ringer
js/ics.js        calendar export
js/views/        today, habits, skills, calendar, timer, alarms, vision (life), settings, quiz
tests/           node --test
```
