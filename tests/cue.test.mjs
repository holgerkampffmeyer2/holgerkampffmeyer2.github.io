import { describe, it, expect } from 'vitest';

import {
  parseCue,
  toFsPath,
  isNonTrack,
  extractBracketLabel,
  extractLabelFromTags,
} from '../scripts/lib/cue.mjs';

const CUE = [
  'REM RECORDED_BY "rekordbox-dj"',
  'TITLE "DJ Hulk - 365 FM Exclusive - UKG"',
  'PERFORMER "DJ Hulk"',
  'FILE "01 DJ Hulk - 365 FM Exclusive - UKG.wav" WAVE',
  '\tTRACK 01 AUDIO',
  '\t\tTITLE "Music is the Answer(Litchy & Smiley Edit)"',
  '\t\tPERFORMER "Litchy & Smiley"',
  '\t\tFILE "C:/Users/holge/Music/Mixx/House 2026/Music is the Answer.m4a" WAVE',
  '\t\tINDEX 01 00:00:00',
  '\tTRACK 02 AUDIO',
  '\t\tTITLE "holgerkampffmey_Dry_Jingle3"',
  '\t\tFILE "C:/Users/holge/Music/Mixx/DJ Hulk - Jingles/holgerkampffmey_Dry_Jingle3.mp3" WAVE',
  '\t\tINDEX 01 00:00:03',
  '\tTRACK 03 AUDIO',
  '\t\tTITLE "On My Mind"',
  '\t\tPERFORMER "Lazy Susan"',
  '\t\tFILE "C:/Users/holge/Music/Mixx/House_2025/Lazy Susan - On My Mind.mp3" WAVE',
  '\t\tINDEX 01 00:03:00',
].join('\n');

describe('parseCue', () => {
  const entries = parseCue(CUE);

  it('parses each track with number, title, performer and file', () => {
    expect(entries).toHaveLength(3);
    expect(entries[0]).toMatchObject({
      number: 1,
      title: 'Music is the Answer(Litchy & Smiley Edit)',
      performer: 'Litchy & Smiley',
      file: 'C:/Users/holge/Music/Mixx/House 2026/Music is the Answer.m4a',
    });
  });

  it('ignores the top-level mix FILE and title', () => {
    expect(entries[0].file).not.toContain('365 FM Exclusive - UKG.wav');
  });

  it('leaves the performer empty when the track has none', () => {
    expect(entries[1].performer).toBe('');
  });
});

describe('toFsPath', () => {
  it('converts a Windows path to a WSL path', () => {
    expect(toFsPath('C:/Users/holge/Music/x.mp3')).toBe('/mnt/c/Users/holge/Music/x.mp3');
  });

  it('converts backslashes', () => {
    expect(toFsPath('D:\\Audio\\Track.wav')).toBe('/mnt/d/Audio/Track.wav');
  });

  it('keeps a Linux path unchanged', () => {
    expect(toFsPath('/home/user/track.mp3')).toBe('/home/user/track.mp3');
  });
});

describe('isNonTrack', () => {
  it('flags jingles', () => {
    expect(isNonTrack({ title: 'holgerkampffmey_Dry_Jingle3' })).toBe(true);
  });

  it('keeps real tracks', () => {
    expect(isNonTrack({ title: 'On My Mind', file: 'Lazy Susan - On My Mind.mp3' })).toBe(false);
  });
});

describe('extractBracketLabel', () => {
  it('reads a label from square brackets', () => {
    expect(extractBracketLabel('VASA - All I Need [Dark Roast Records]')).toBe('Dark Roast Records');
  });

  it('ignores mix qualifiers, genre and country codes', () => {
    expect(extractBracketLabel('Track [Extended Mix]')).toBe('');
    expect(extractBracketLabel('Track [Original]')).toBe('');
    expect(extractBracketLabel('Track [Afro House]')).toBe('');
    expect(extractBracketLabel('Track [IT]')).toBe('');
    expect(extractBracketLabel('Track [FR 12]')).toBe('');
  });

  it('returns the first valid bracket when several are present', () => {
    expect(extractBracketLabel('Track [Extended] [Lapsus Music]')).toBe('Lapsus Music');
  });
});

describe('extractLabelFromTags', () => {
  it('prefers the publisher tag', () => {
    expect(extractLabelFromTags({ publisher: 'Stig Records' })).toEqual({ label: 'Stig Records', source: 'publisher' });
  });

  it('reads the label from the track title in square brackets', () => {
    expect(extractLabelFromTags({}, { title: 'VASA - All I Need [Dark Roast Records]' }))
      .toEqual({ label: 'Dark Roast Records', source: 'title' });
  });

  it('reads the label from the file name in square brackets', () => {
    expect(extractLabelFromTags({}, { file: '/music/Artist - Title [Lapsus Music].mp3' }))
      .toEqual({ label: 'Lapsus Music', source: 'title' });
  });

  it('reads the album bracket pattern', () => {
    expect(extractLabelFromTags({ album: 'Some Compilation [Lapsus Music]' }))
      .toEqual({ label: 'Lapsus Music', source: 'album' });
  });

  it('reads the "on behalf of" comment pattern', () => {
    expect(extractLabelFromTags({ comment: 'on behalf of Moom Sound by label-engine.com' }))
      .toEqual({ label: 'Moom Sound', source: 'comment' });
  });

  it('rejects generic promo services', () => {
    expect(extractLabelFromTags({ comment: 'Promo-Cloud.Com' })).toBeNull();
    expect(extractLabelFromTags({ publisher: 'Delivered By Inflyte' })).toBeNull();
  });

  it('returns null when no tag carries a label', () => {
    expect(extractLabelFromTags({ comment: 'thanks for the support' })).toBeNull();
    expect(extractLabelFromTags({})).toBeNull();
  });
});
