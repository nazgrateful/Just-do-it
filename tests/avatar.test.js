import test from 'node:test';
import assert from 'node:assert/strict';
import { OPTIONS, SCENES, ROOM_ITEMS, SKIES, FLOORS, defaultAvatar, normalizeAvatar, sceneSvg, randomize } from '../js/avatar.js';

const wellFormed = (svg) => svg.startsWith('<svg') && svg.trim().endsWith('</svg>') && !svg.includes('undefined') && !svg.includes('NaN');

test('every outfit option draws', () => {
  const a = defaultAvatar();
  for (const [key, list] of Object.entries(OPTIONS)) {
    for (const v of list) {
      const b = key === 'extras' ? { ...a, extras: [v] } : { ...a, [key]: v };
      assert.ok(wellFormed(sceneSvg(b)), `${key}: ${v}`);
    }
  }
});

test('every place, sky, floor and thing draws', () => {
  const a = defaultAvatar();
  for (const p of Object.keys(SCENES)) assert.ok(wellFormed(sceneSvg({ ...a, scene: { preset: p, ...SCENES[p] } })), p);
  for (const sky of SKIES) for (const floor of FLOORS) assert.ok(wellFormed(sceneSvg({ ...a, scene: { ...a.scene, sky, floor, outdoor: sky === 'night' } })));
  assert.ok(wellFormed(sceneSvg({ ...a, scene: { ...a.scene, items: ROOM_ITEMS } })), 'all things at once');
});

test('old or missing saves get a full avatar; names are escaped', () => {
  const n = normalizeAvatar({ hair: 'bun' });
  assert.equal(n.hair, 'bun');
  assert.ok(Array.isArray(n.extras) && Array.isArray(n.scene.items));
  assert.ok(!sceneSvg({ ...n, name: '<script>' }).includes('<script>'));
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 40; i++) assert.ok(wellFormed(sceneSvg(randomize(n, rnd))));
});
