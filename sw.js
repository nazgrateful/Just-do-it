// Service worker: works offline, and installs updates only when you tap "Update".
// It never touches your saved data (that lives in localStorage, not in this cache).
const CACHE = 'just-do-it-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './icons/icon.svg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './js/app.js',
  './js/alarmcore.js',
  './js/backup.js',
  './js/data.js',
  './js/ics.js',
  './js/plan.js',
  './js/ring.js',
  './js/store.js',
  './js/util.js',
  './js/version.js',
  './js/views/alarms.js',
  './js/views/calendar.js',
  './js/views/files.js',
  './js/views/guide.js',
  './js/views/habits.js',
  './js/views/quiz.js',
  './js/views/settings.js',
  './js/views/sheet.js',
  './js/views/skills.js',
  './js/views/timer.js',
  './js/views/today.js',
  './js/views/vision.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))));
  // No skipWaiting here: the page shows an "Update" button and asks us to switch.
});

self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Cache-first from this version's cache, so an update only applies when you choose it.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    caches.open(CACHE).then((c) =>
      c.match(e.request, { ignoreSearch: true }).then(
        (hit) =>
          hit ||
          fetch(e.request)
            .then((res) => {
              if (res.status === 200) c.put(e.request, res.clone()).catch(() => {});
              return res;
            })
            .catch(() => (e.request.mode === 'navigate' ? c.match('./index.html') : Response.error())),
      ),
    ),
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if ('focus' in c) return c.focus();
      return self.clients.openWindow('./#alarms');
    }),
  );
});
