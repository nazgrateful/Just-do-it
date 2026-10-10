// Makes the timer ring with the screen off.
//
// Phones pause a web page's code when the screen turns off, but they keep playing audio.
// So when a countdown starts we build ONE audio track: silence for exactly the time left,
// then the alarm. It plays from the moment you tap Start, so the alarm sounds on time
// even if the app is asleep.
//
// The track is plain MP3 (plays on every phone) stitched together from two pieces that
// were encoded once with LAME (16 kHz mono, 8 kbps, no bit reservoir, so frames stand alone):
//   - one 36-byte silent frame (36 ms), repeated for the countdown, about 1 KB per second
//   - a 1.152 s chunk of rising alarm beeps (32 frames), repeated for the ringing part

const SILENT_FRAME = '//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA';
const RING_CHUNK =
  '//MYxAAFmJ6sQYGgAAwwf//H/LQFAACgz/A3xAAUSIHIJ8MA//MYxAAEWJMgYYCgAsBgABH2BgyejqCK8FgzrL3KqYgpqKAA//MYxAAFkIasIc3YA4f//0loomRkAW4JGYirHisrUJY16/FA//MYxAAFIIqkAAB4ocwV5QyNJhAkYLMZ08mBwbbSX2MwNMQQ//MYxAAFkIa4IVHQA4f//6aaiYFICGAMwwdk6D4FHF0TtOPA//MYxAAEgJrYAYCYAJgGAqwSDi0AemmmAPo+0NUl10xBTUUA//MYxAAFoNKgQYCIAAAgXKABs+4N5g35vkSICI/As//HMM0w//MYxAAFsLrkQYCQAPMPtWrrJ4LnAGfnAnAOtZgMkC1J+T2s//MYxAAFuK6cAcDgAf+5bpHrXYLAY07xRGUjEoQSCfV3Z3Ia//MYxAAEuKqQAAC64ehQz6hcFjZiNBUSwgBmWw9S2haYgpqK//MYxAAFWKa4QUHQAyA////wf/4b2pWX/PzBCCzDGISzEemA//MYxAAFuM9kgYCYAgAHeaqv/TFdDw4mwW1ZQAj4qnn5W8rM//MYxAAFUNKYAYGgAP/5+tEy/Ng/ADOvBSP7uSJeSdv0zdMA//MYxAAFoM7oQYCgAAMPP/oFL+sMaBjBWEzwFpoxp+EgQzKQ//MYxAAFmMq0AcDYAP////3jVpbDWi8xiYod6g08EUXYXTZA//MYxAAFoMacAAP3Afq0JrSBRkAIIaE2P+CoSuR3G3KwJ8lg//MYxAAFUMqcAAM5AM3LRG4sT7MQBQ/0LxIsJrsrXxD03pMA//MYxAAFwLboeUB4AgNAuAMZ3St/8ywpl6gugKufzfpCIEYO//MYxAAFmL6cAYCgANv1Ik+YZiY+Bk4wHZdDJjZNzIjUXa0A//MYxAAAAANIAcAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAAAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA//MYxAAAAANIAUAAAExBTUUzLjEwMAAAAAAAAAAAAAAAAAAA';

export const FRAME_SECONDS = 576 / 16000; // 36 ms
export const CHUNK_SECONDS = 32 * FRAME_SECONDS; // 1.152 s
export const RING_SECONDS = 60;
export const MAX_SECONDS = 4 * 60 * 60; // 4 hours ≈ 14 MB of mostly silence

const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/** MP3 bytes: `silence` seconds of quiet, then about `ring` seconds of alarm beeps. */
export function buildTimerMp3(silence, { ring = RING_SECONDS } = {}) {
  const sil = b64(SILENT_FRAME);
  const chunk = b64(RING_CHUNK);
  const nSil = Math.max(0, Math.round(silence / FRAME_SECONDS));
  const nRing = Math.max(1, Math.round(ring / CHUNK_SECONDS));
  const out = new Uint8Array(nSil * sil.length + nRing * chunk.length);
  for (let i = 0; i < nSil; i++) out.set(sil, i * sil.length);
  const base = nSil * sil.length;
  for (let i = 0; i < nRing; i++) out.set(chunk, base + i * chunk.length);
  return out;
}

// One player per use ("timer", "night"), so stopping one never silences the other.
const players = {};
const stopHandlers = {};

/** Start the track. Must be called from a tap (browsers only allow sound after one). */
export async function armTimerSound(secondsLeft, { volume = 1, label = 'Timer', endsAt, owner = 'timer', maxSeconds = MAX_SECONDS } = {}) {
  disarmTimerSound(owner);
  if (secondsLeft > maxSeconds) return false;
  const p = (players[owner] = {});
  try {
    p.url = URL.createObjectURL(new Blob([buildTimerMp3(secondsLeft)], { type: 'audio/mpeg' }));
    p.audio = new Audio(p.url);
    p.audio.preload = 'auto';
    p.audio.volume = Math.max(0.2, Math.min(1, volume));
    p.audio.setAttribute('playsinline', '');
    try {
      if (navigator.audioSession) navigator.audioSession.type = 'playback'; // iOS 17+: play through the silent switch
    } catch {}
    await p.audio.play();
    lockScreenControls(label, endsAt, owner);
    return true;
  } catch {
    disarmTimerSound(owner);
    return false;
  }
}

export function disarmTimerSound(owner = 'timer') {
  const p = players[owner];
  if (!p) return;
  if (p.audio) {
    p.audio.pause();
    p.audio.removeAttribute('src');
    p.audio.load();
  }
  if (p.url) URL.revokeObjectURL(p.url);
  delete players[owner];
  try {
    if (navigator.mediaSession && !Object.keys(players).length) navigator.mediaSession.metadata = null;
  } catch {}
}

export const timerSoundArmed = (owner = 'timer') => !!players[owner]?.audio && !players[owner].audio.paused;

/** Lock-screen card with the ring time and a Stop button. */
export function setLockScreenStop(fn, owner = 'timer') {
  stopHandlers[owner] = fn;
}
function lockScreenControls(label, endsAt, owner) {
  const ms = navigator.mediaSession;
  if (!ms || typeof MediaMetadata === 'undefined') return;
  try {
    ms.metadata = new MediaMetadata({
      title: label,
      artist: endsAt ? `Rings at ${endsAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Just Do It',
      album: 'Just Do It',
      artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
    });
    for (const action of ['pause', 'stop']) ms.setActionHandler(action, () => stopHandlers[owner]?.());
  } catch {}
}

/** Android: put the same countdown in the phone's Clock app (it rings with the app closed). */
export function androidTimerIntent(seconds, label, fallback) {
  return (
    'intent:#Intent;action=android.intent.action.SET_TIMER;' +
    `i.android.intent.extra.alarm.LENGTH=${Math.max(1, Math.round(seconds))};` +
    `S.android.intent.extra.alarm.MESSAGE=${encodeURIComponent(label || 'Timer').replace(/;/g, '%3B')};` +
    'B.android.intent.extra.alarm.SKIP_UI=true;' +
    (fallback ? `S.browser_fallback_url=${encodeURIComponent(fallback)};` : '') +
    'end'
  );
}
