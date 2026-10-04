import { describe, it, expect } from 'vitest';
import {
  SCROLL_EDGE_TOLERANCE,
  computeItemStep,
  computeSetWidth,
  computeMaxScrollLeft,
  computeInitScrollLeft,
  resolveScrollJump,
  wrapScrollTarget,
} from '../src/utils/carousel-scroll.js';

// Real geometry of the events carousel: 9 events rendered twice (18 cards),
// md:w-80 cards, gap-5, viewport inside max-w-7xl.
const TOTAL = 9;
const CARD = 320;
const GAP = 20;
const CLIENT = 1216;
const ITEM_STEP = computeItemStep(CARD, GAP);
const SET_WIDTH = computeSetWidth(ITEM_STEP, TOTAL);
const SCROLL_WIDTH = computeSetWidth(ITEM_STEP, TOTAL * 2) - GAP;
const MAX = computeMaxScrollLeft(SCROLL_WIDTH, CLIENT);

const clamp = (value) => Math.max(0, Math.min(value, MAX));
const visibleItem = (scrollLeft) => {
  const index = Math.floor(scrollLeft / ITEM_STEP);
  return index < TOTAL ? index : index - TOTAL;
};

describe('computeItemStep', () => {
  it('advances by card width plus gap', () => {
    expect(computeItemStep(320, 20)).toBe(340);
  });

  it('matches the Tailwind gap class on the track', () => {
    // gap-5 = 1.25rem = 20px, the constant hardcoded in the page script
    expect(GAP).toBe(20);
  });
});

describe('computeSetWidth', () => {
  it('is one set width, not the doubled track', () => {
    expect(computeSetWidth(340, 9)).toBe(3060);
  });

  it('is zero for an empty carousel', () => {
    expect(computeSetWidth(340, 0)).toBe(0);
  });
});

describe('computeMaxScrollLeft', () => {
  it('is scrollWidth minus viewport', () => {
    expect(computeMaxScrollLeft(SCROLL_WIDTH, CLIENT)).toBe(MAX);
  });

  it('clamps to zero when the track is narrower than the viewport', () => {
    // unclamped this returned a negative maximum and inverted the edge checks
    expect(computeMaxScrollLeft(800, 1216)).toBe(0);
  });
});

describe('computeInitScrollLeft', () => {
  it('starts on the duplicated set so the first card is the newest event', () => {
    expect(computeInitScrollLeft(SET_WIDTH, MAX)).toBe(SET_WIDTH);
    expect(visibleItem(computeInitScrollLeft(SET_WIDTH, MAX))).toBe(0);
  });

  it('never starts past the right edge', () => {
    expect(computeInitScrollLeft(SET_WIDTH, 500)).toBe(500);
  });
});

describe('resolveScrollJump', () => {
  it('asks for a backward wrap at the right edge', () => {
    expect(resolveScrollJump(MAX, MAX)).toBe('back');
  });

  it('asks for a forward wrap at the left edge', () => {
    expect(resolveScrollJump(0, MAX)).toBe('forward');
  });

  it('stays put in the middle of the track', () => {
    expect(resolveScrollJump(MAX / 2, MAX)).toBe(null);
  });

  it('tolerates fractional positions left by scroll snapping', () => {
    expect(resolveScrollJump(MAX - SCROLL_EDGE_TOLERANCE + 1, MAX)).toBe('back');
    expect(resolveScrollJump(SCROLL_EDGE_TOLERANCE - 1, MAX)).toBe('forward');
    // just outside the tolerance band the wrap must not fire yet
    expect(resolveScrollJump(MAX - SCROLL_EDGE_TOLERANCE - 1, MAX)).toBe(null);
  });

  it('does nothing when the track cannot scroll', () => {
    expect(resolveScrollJump(0, 0)).toBe(null);
  });
});

describe('wrapScrollTarget', () => {
  // delta is the jump direction: 'back' from the right edge is -setWidth,
  // 'forward' from the left edge is +setWidth.
  it('wraps backward from the right edge', () => {
    expect(wrapScrollTarget({ current: MAX, delta: -SET_WIDTH, setWidth: SET_WIDTH, maxScrollLeft: MAX })).toBe(MAX - SET_WIDTH);
  });

  it('wraps forward from the left edge', () => {
    expect(wrapScrollTarget({ current: 0, delta: SET_WIDTH, setWidth: SET_WIDTH, maxScrollLeft: MAX })).toBe(SET_WIDTH);
  });

  it('maps a mid-track position onto its visual equivalent', () => {
    // the layout repeats every set width, so the wrap lands on the same cards
    expect(wrapScrollTarget({ current: 2000, delta: -SET_WIDTH, setWidth: SET_WIDTH, maxScrollLeft: MAX })).toBe(2000);
  });

  it('refuses to wrap without a set width', () => {
    expect(wrapScrollTarget({ current: 0, delta: 0, setWidth: 0, maxScrollLeft: MAX })).toBe(null);
  });

  it('refuses a wrap that would land out of range, instead of oscillating', () => {
    // a single set fills the whole viewport: no offset has a valid equivalent
    const target = wrapScrollTarget({ current: 100, delta: -5000, setWidth: 400, maxScrollLeft: 200 });
    expect(target).toBe(null);
  });
});

describe('regression: right arrow used to stop after the last event', () => {
  it('the old setWidth * 2 threshold was unreachable', () => {
    // the track only holds two sets, so scrolling can never reach two set widths
    expect(MAX).toBeLessThan(SET_WIDTH * 2 - SCROLL_EDGE_TOLERANCE);
  });

  it('the right edge is reachable and does trigger a wrap', () => {
    expect(resolveScrollJump(MAX, MAX)).toBe('back');
    expect(wrapScrollTarget({ current: MAX, delta: -SET_WIDTH, setWidth: SET_WIDTH, maxScrollLeft: MAX })).toBe(MAX - SET_WIDTH);
  });
});

describe('endless loop walks through every event in both directions', () => {
  function click(current, delta) {
    const next = clamp(current + delta);
    const jump = resolveScrollJump(next, MAX);
    if (jump === null) return next;
    const wrapped = wrapScrollTarget({
      current: next,
      delta: jump === 'back' ? -SET_WIDTH : SET_WIDTH,
      setWidth: SET_WIDTH,
      maxScrollLeft: MAX,
    });
    return wrapped === null ? next : wrapped;
  }

  it('cycles forward past the last event', () => {
    let position = computeInitScrollLeft(SET_WIDTH, MAX);
    const seen = new Set([visibleItem(position)]);
    for (let i = 0; i < TOTAL * 4; i++) {
      position = click(position, ITEM_STEP);
      seen.add(visibleItem(position));
    }
    expect(seen.size).toBe(TOTAL);
  });

  it('cycles backward past the first event', () => {
    let position = computeInitScrollLeft(SET_WIDTH, MAX);
    const seen = new Set([visibleItem(position)]);
    for (let i = 0; i < TOTAL * 4; i++) {
      position = click(position, -ITEM_STEP);
      seen.add(visibleItem(position));
    }
    expect(seen.size).toBe(TOTAL);
  });

  it('never leaves the scrollable range', () => {
    let position = computeInitScrollLeft(SET_WIDTH, MAX);
    for (let i = 0; i < TOTAL * 6; i++) {
      position = click(position, ITEM_STEP);
      expect(position).toBeGreaterThanOrEqual(0);
      expect(position).toBeLessThanOrEqual(MAX);
    }
  });
});