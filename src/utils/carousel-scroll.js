/**
 * Pure scroll arithmetic for the endless events carousel.
 * DOM-free on purpose so the wrap-around logic stays unit testable
 * (vitest runs in the node environment, no jsdom available).
 * Usage: import { wrapScrollTarget } from '../utils/carousel-scroll.js';
 */

/** Tolerance in px, so fractional positions from scroll snapping still trigger a wrap. */
export const SCROLL_EDGE_TOLERANCE = 5;

/**
 * Distance one card advance scrolls. `gap` must match the Tailwind gap class
 * on the carousel track (gap-5 = 1.25rem = 20px).
 */
export function computeItemStep(cardWidth, gap) {
  return cardWidth + gap;
}

/** Width of one full set of cards, i.e. the distance the loop repeats on. */
export function computeSetWidth(itemStep, itemCount) {
  return itemStep * itemCount;
}

/** Furthest reachable scrollLeft. Clamped, otherwise a track narrower than the viewport yields a negative maximum. */
export function computeMaxScrollLeft(scrollWidth, clientWidth) {
  return Math.max(0, scrollWidth - clientWidth);
}

/**
 * Start position: the beginning of the duplicated set. Scrolling left from there
 * wraps without a visible jump, so it must be one set width - never 0.
 */
export function computeInitScrollLeft(setWidth, maxScrollLeft) {
  return Math.min(setWidth, maxScrollLeft);
}

/**
 * Which wrap the current position needs, or null when it is mid-track.
 * 'back' at the right edge, 'forward' at the left edge.
 */
export function resolveScrollJump(scrollLeft, maxScrollLeft, tolerance = SCROLL_EDGE_TOLERANCE) {
  if (maxScrollLeft <= 0) return null;
  if (scrollLeft >= maxScrollLeft - tolerance) return "back";
  if (scrollLeft <= tolerance) return "forward";
  return null;
}

/**
 * Target for a wrap of exactly one set width.
 * Returns null when no valid position exists, e.g. when a single set already
 * fills the viewport - the caller must then skip the wrap instead of
 * oscillating between two out-of-range positions.
 */
export function wrapScrollTarget({ current, delta, setWidth, maxScrollLeft }) {
  if (setWidth <= 0 || maxScrollLeft < 0) return null;
  let target = current + delta;
  if (target < 0) target += setWidth;
  if (target > maxScrollLeft) target -= setWidth;
  if (target < 0 || target > maxScrollLeft) return null;
  return target;
}