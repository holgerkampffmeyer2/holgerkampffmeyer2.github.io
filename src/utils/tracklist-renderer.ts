import { buildTrackLabels } from './track-labels.js';
import labels from '../data/labels.json';

const trackLabels = buildTrackLabels(labels);

function splitTrack(track: string) {
  const parts = track.split(' - ');
  const artist = parts[0]?.replace(/,$/, '') || '';
  const title = parts.slice(1).join(' - ').replace(/,$/, '') || track;
  return { artist, title };
}

function getMobileTrackHTML(track: string, showLabel: boolean) {
  const { artist, title } = splitTrack(track);
  const label = trackLabels.get(track);
  const labelHTML = showLabel && label
    ? `<span class="ml-1"><span class="text-[var(--color-text-muted)] text-sm">(</span>${label.url
        ? `<a href="${label.url}" target="_blank" rel="noopener noreferrer nofollow" class="text-[var(--color-secondary)] hover:underline text-sm">${label.name}</a>`
        : `<span class="text-[var(--color-text-muted)] text-sm">${label.name}</span>`
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

export function renderMobileTracklist(tracks: string[], showLabel: boolean): string {
  return tracks.map(track => getMobileTrackHTML(track, showLabel)).join('');
}