import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTimerMp3, FRAME_SECONDS, CHUNK_SECONDS, androidTimerIntent } from '../js/timeraudio.js';

// Walk MPEG-2 Layer III frame headers.
function frames(b) {
  const out = [];
  let i = 0;
  while (i + 4 <= b.length) {
    assert.equal(b[i], 0xff, `frame sync at byte ${i}`);
    assert.equal(b[i + 1] & 0xe0, 0xe0);
    const brIdx = b[i + 2] >> 4;
    const pad = (b[i + 2] >> 1) & 1;
    const kbps = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160][brIdx];
    const size = Math.floor((72 * kbps * 1000) / 16000) + pad;
    out.push(b.subarray(i, i + size));
    i += size;
  }
  assert.equal(i, b.length, 'ends on a frame boundary');
  return out;
}

test('timer track: silence for the countdown, then the alarm', () => {
  const mp3 = buildTimerMp3(10, { ring: 5 });
  const f = frames(mp3);
  const silentFrames = Math.round(10 / FRAME_SECONDS);
  const ringFrames = Math.round(5 / CHUNK_SECONDS) * 32;
  assert.equal(f.length, silentFrames + ringFrames);
  // every countdown frame is the same silent frame
  assert.ok(f.slice(0, silentFrames).every((x) => x.length === f[0].length && x.every((v, k) => v === f[0][k])));
  // the ring frames are different (they carry sound)
  assert.ok(f.slice(silentFrames).some((x) => x.some((v, k) => v !== f[0][k])));
});

test('track sizes stay phone-friendly', () => {
  assert.ok(buildTimerMp3(25 * 60).length < 2 * 1024 * 1024); // 25 min < 2 MB
  assert.ok(buildTimerMp3(4 * 60 * 60).length < 16 * 1024 * 1024); // 4 h < 16 MB
});

test('android clock timer intent', () => {
  assert.equal(
    androidTimerIntent(1500, 'Focus; go'),
    'intent:#Intent;action=android.intent.action.SET_TIMER;i.android.intent.extra.alarm.LENGTH=1500;S.android.intent.extra.alarm.MESSAGE=Focus%3B%20go;B.android.intent.extra.alarm.SKIP_UI=true;end',
  );
});
