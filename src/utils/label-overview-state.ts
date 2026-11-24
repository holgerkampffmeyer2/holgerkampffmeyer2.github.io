import { scoreLabelMatch, type LabelSearchEntry } from './label-search.js';

export type LabelSortKey = 'name' | 'tracks' | 'mixes' | 'latest';
export type LabelSortDirection = 'asc' | 'desc';

export interface LabelOverviewState {
  q: string;
  sort: LabelSortKey;
  dir: LabelSortDirection;
  minTracks: number;
  page: number;
  perPage: number;
}

export interface LabelSortableEntry extends LabelSearchEntry {
  trackCount: number;
  mixCount: number;
  latestDate: string;
}

export interface LabelPageResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

const DEFAULT_STATE: LabelOverviewState = {
  q: '',
  sort: 'tracks',
  dir: 'desc',
  minTracks: 0,
  page: 1,
  perPage: 25,
};

function readParam(params: URLSearchParams | Record<string, string | undefined>, key: string): string | undefined {
  return params instanceof URLSearchParams ? params.get(key) ?? undefined : params[key];
}

export function parseLabelOverviewState(
  params: URLSearchParams | Record<string, string | undefined>
): LabelOverviewState {
  const sortParam = readParam(params, 'sort') as LabelSortKey | undefined;
  const dirParam = readParam(params, 'dir') as LabelSortDirection | undefined;
  const minTracksParam = Number(readParam(params, 'minTracks'));
  const pageParam = Number(readParam(params, 'page'));
  const perPageParam = Number(readParam(params, 'perPage'));

  const sort: LabelSortKey = ['name', 'tracks', 'mixes', 'latest'].includes(sortParam ?? '')
    ? sortParam!
    : DEFAULT_STATE.sort;
  const dir: LabelSortDirection = dirParam === 'asc' || dirParam === 'desc'
    ? dirParam
    : DEFAULT_STATE.dir;

  return {
    q: readParam(params, 'q')?.trim() ?? '',
    sort,
    dir,
    minTracks: minTracksParam === 3 ? 3 : 0,
    page: Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1,
    perPage: perPageParam === 50 ? 50 : 25,
  };
}

export function serializeLabelOverviewState(state: LabelOverviewState): string {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.sort !== DEFAULT_STATE.sort) params.set('sort', state.sort);
  if (state.dir !== DEFAULT_STATE.dir) params.set('dir', state.dir);
  if (state.minTracks !== DEFAULT_STATE.minTracks) params.set('minTracks', String(state.minTracks));
  if (state.page !== DEFAULT_STATE.page) params.set('page', String(state.page));
  if (state.perPage !== DEFAULT_STATE.perPage) params.set('perPage', String(state.perPage));

  const query = params.toString();
  return query ? `?${query}` : '';
}

export function filterAndSortLabelEntries<T extends LabelSortableEntry>(
  entries: T[],
  state: LabelOverviewState
): T[] {
  const filtered = entries.filter((entry) => {
    if (state.minTracks && entry.trackCount < state.minTracks) return false;
    return !state.q || scoreLabelMatch(entry, state.q) > 0;
  });

  const factor = state.dir === 'asc' ? 1 : -1;
  return filtered.sort((a, b) => {
    const comparison =
      state.sort === 'name'
        ? a.name.localeCompare(b.name, 'de')
        : state.sort === 'tracks'
          ? a.trackCount - b.trackCount
          : state.sort === 'mixes'
            ? a.mixCount - b.mixCount
            : a.latestDate.localeCompare(b.latestDate);

    return comparison === 0 ? a.name.localeCompare(b.name, 'de') : comparison * factor;
  });
}

export function paginateLabelEntries<T>(entries: T[], state: LabelOverviewState): LabelPageResult<T> {
  const totalItems = entries.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / state.perPage));
  const page = Math.min(Math.max(1, state.page), totalPages);
  const start = (page - 1) * state.perPage;

  return {
    items: entries.slice(start, start + state.perPage),
    page,
    totalPages,
    totalItems,
  };
}
