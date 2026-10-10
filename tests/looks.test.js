import test from 'node:test';
import assert from 'node:assert/strict';
import { LOOKS, LOOK_CATEGORIES, FONTS, SHAPES, PATTERNS, lookVars, contrast, bubbleShape } from '../js/looks.js';

test('catalog is complete and well-formed', () => {
  assert.ok(LOOKS.length >= 150, `${LOOKS.length} looks`);
  assert.ok(LOOK_CATEGORIES.length >= 10);
  const ids = new Set();
  for (const l of LOOKS) {
    assert.ok(!ids.has(l.id), `duplicate ${l.id}`);
    ids.add(l.id);
    for (const c of [l.bg, l.surface, l.ink, l.accent, l.accent2]) assert.match(c, /^#[0-9a-f]{6}$/i, `${l.name} colour ${c}`);
    assert.ok(FONTS[l.head] && FONTS[l.body], `${l.name} fonts`);
    assert.ok(SHAPES[l.shape], `${l.name} shape`);
    assert.ok(PATTERNS.includes(l.pattern), `${l.name} pattern`);
  }
});

test('every look keeps text readable, in light and dark mode', () => {
  for (const l of LOOKS)
    for (const dark of [false, true]) {
      const { vars } = lookVars(l, dark);
      const where = `${l.name}${dark ? ' (dark)' : ''}`;
      assert.ok(contrast(vars['--ink'], vars['--surface']) >= 7, `${where}: text on boxes`);
      assert.ok(contrast(vars['--ink'], vars['--bg']) >= 7, `${where}: text on background`);
      assert.ok(contrast(vars['--accent-text'], vars['--surface']) >= 4.5, `${where}: links`);
      assert.ok(contrast(vars['--on-accent'], vars['--accent']) >= 4.5, `${where}: button text`);
    }
});

test('bubble shapes match the look', () => {
  const by = (id) => bubbleShape(LOOKS.find((l) => l.id === id));
  assert.equal(by('kawaii'), 'heart');
  assert.equal(by('celestial'), 'star');
  assert.equal(by('cottagecore'), 'flower');
  assert.equal(by('cyberpunk'), 'hexagon');
  assert.equal(by('brutalism'), 'square');
});
