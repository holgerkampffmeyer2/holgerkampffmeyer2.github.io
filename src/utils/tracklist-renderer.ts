import labels from '../data/labels.json';
import { buildTrackLabels } from './track-labels.js';
import { buildStructuredTracks, type TrackLabelResolver } from './mix-track-data';

const defaultTrackLabels = buildTrackLabels(labels) as TrackLabelResolver;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getTrackHTML(track: { artist: string; title: string; label: { name: string; url: string | null } | null }, showLabel: boolean): string {
  const artist = escapeHtml(track.artist);
  const title = escapeHtml(track.title);
  const label = track.label;
  const labelHTML = showLabel && label
    ? `<span class="ml-1"><span class="text-[var(--color-text-muted)] text-sm">(</span>${label.url
        ? `<a href="${escapeHtml(label.url)}" target="_blank" rel="noopener noreferrer nofollow" class="text-[var(--color-secondary)] hover:underline text-sm">${escapeHtml(label.name)}</a>`
        : `<span class="text-[var(--color-text-muted)] text-sm">${escapeHtml(label.name)}</span>`
      }<span class="text-[var(--color-text-muted)] text-sm">)</span></span>`
    : '';

  return `
    <div class="flex flex-col gap-1 py-2 border-b border-[var(--color-border)] last:border-0">
      <div class="flex items-baseline gap-2 flex-wrap">
        <span class="font-semibold text-sm text-[var(--color-text)]">${artist}</span>
        <span class="text-[var(--color-text-muted)] text-sm">–</span>
        <span class="text-sm text-[var(--color-text)]">${title}</span>
        ${labelHTML}
      </div>
    </div>
  `;
}

export function renderMobileTracklist(
  tracks: string[],
  showLabel: boolean,
  trackLabels: TrackLabelResolver = defaultTrackLabels
): string {
  return buildStructuredTracks(tracks, trackLabels)
    .map((track) => getTrackHTML(track, showLabel))
    .join('');
}
