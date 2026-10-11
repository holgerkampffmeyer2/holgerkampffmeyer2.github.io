/**
 * CUE-Sheet-Parser und Label-Extraktion aus den Quelldatei-Tags.
 *
 * Die Rekordbox-CUEs referenzieren je Track die tatsächliche Quelldatei
 * (`FILE "C:/.../Track.mp3"`). Das Label steckt nicht im CUE, sondern in den
 * Tags dieser Quelldatei. Bevorzugte Quellen: `publisher`/`label`-Tag,
 * Album-`[Label]`-Muster, Promo-`comment` ("on behalf of <Label> by ...").
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { cleanLabel, extractBracketLabel } from './label-clean.mjs';

const execFileAsync = promisify(execFile);

const NON_TRACK_RE = /jingle|holgerkampffmey|sweeper/i;
const TAG_KEYS = ['label', 'organization', 'publisher', 'title', 'album', 'comment'];

export { extractBracketLabel } from './label-clean.mjs';

/**
 * Ermittelt den Label-Kandidaten aus Tags sowie Dateiname/Titel.
 *
 * Priorität: Label-/Publisher-Tag > `[Label]` in Titel/Dateiname > Album-Klammer
 * > Promo-comment ("on behalf of <Label> by ...").
 * @param {Record<string, string>} tags
 * @param {{ title?: string, file?: string }} [sources]
 * @returns {{ label: string, source: string } | null}
 */
export function extractLabelFromTags(tags, sources = {}) {
  const safeTags = tags ?? {};
  for (const key of ['label', 'organization', 'publisher']) {
    const label = cleanLabel(safeTags[key]);
    if (label) return { label, source: key === 'publisher' ? 'publisher' : 'tag' };
  }

  const fileName = sources.file ? path.basename(sources.file) : '';
  for (const text of [sources.title, fileName, safeTags.title]) {
    const label = extractBracketLabel(text);
    if (label) return { label, source: 'title' };
  }

  const albumLabel = extractBracketLabel(safeTags.album);
  if (albumLabel) return { label: albumLabel, source: 'album' };

  const comment = String(safeTags.comment ?? '');
  const behalf = comment.match(/on behalf of\s+(.+?)(?:\s+by\s|\s*$)/i);
  if (behalf) {
    const label = cleanLabel(behalf[1]);
    if (label) return { label, source: 'comment' };
  }
  return null;
}

/**
 * Formatiert einen Windows-Pfad aus einem CUE-`FILE`-Eintrag in einen
 * WSL/Linux-Pfad (`C:/x` → `/mnt/c/x`). Bereits absolute Linux-Pfade bleiben.
 * @param {string} filePath
 * @returns {string}
 */
export function toFsPath(filePath) {
  if (!filePath) return '';
  const raw = String(filePath).trim();
  const win = raw.match(/^([A-Za-z]):[\\/](.*)$/);
  if (win) {
    const rest = win[2].replace(/\\/g, '/');
    return `/mnt/${win[1].toLowerCase()}/${rest}`;
  }
  return raw.replace(/\\/g, '/');
}

/**
 * Prüft, ob ein CUE-Eintrag kein echter Track ist (Jingle, Zwischenansage, Mix).
 * @param {{ title?: string, file?: string }} entry
 * @returns {boolean}
 */
export function isNonTrack(entry) {
  const haystack = `${entry?.title ?? ''} ${entry?.file ?? ''}`;
  return NON_TRACK_RE.test(haystack);
}

/**
 * Parst den Inhalt eines CUE-Sheets in Track-Einträge.
 * @param {string} content
 * @returns {{ number: number | null, title: string, performer: string, file: string }[]}
 */
export function parseCue(content) {
  const entries = [];
  let current = null;
  for (const rawLine of String(content).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const track = line.match(/^TRACK\s+(\d+)\s+AUDIO/i);
    if (track) {
      current = { number: Number(track[1]), title: '', performer: '', file: '' };
      entries.push(current);
      continue;
    }
    if (!current) continue;
    const title = line.match(/^TITLE\s+"(.*)"/i);
    if (title) {
      current.title = title[1];
      continue;
    }
    const performer = line.match(/^PERFORMER\s+"(.*)"/i);
    if (performer) {
      current.performer = performer[1];
      continue;
    }
    const file = line.match(/^FILE\s+"(.*?)"\s+\w+/i);
    if (file) {
      current.file = file[1];
    }
  }
  return entries;
}

/**
 * Findet rekursiv alle CUE-Dateien unterhalb eines Verzeichnisses.
 * @param {string} dir
 * @returns {string[]} absolute Pfade
 */
export function findCueFiles(dir) {
  const out = [];
  const walk = current => {
    for (const item of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, item.name);
      if (item.isDirectory()) walk(full);
      else if (/\.cue$/i.test(item.name)) out.push(full);
    }
  };
  walk(dir);
  return out;
}

/**
 * Liest alle CUE-Dateien unterhalb eines Verzeichnisses und liefert die
 * Track-Einträge inkl. aufgelöstem Quelldatei-Pfad.
 * @param {string} dir
 * @returns {{ title: string, performer: string, file: string, fsPath: string, cueFile: string }[]}
 */
export function readCueDir(dir) {
  const entries = [];
  for (const cueFile of findCueFiles(dir)) {
    const content = fs.readFileSync(cueFile, 'utf-8');
    for (const entry of parseCue(content)) {
      entries.push({
        title: entry.title,
        performer: entry.performer,
        file: entry.file,
        fsPath: toFsPath(entry.file),
        cueFile,
      });
    }
  }
  return entries;
}

/**
 * Liest die relevanten Tags einer Audiodatei über `ffprobe`.
 * @param {string} file
 * @returns {Promise<Record<string, string>>}
 */
export async function readTags(file) {
  if (!file) return {};
  try {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v', 'quiet',
      '-show_entries', `format_tags=${TAG_KEYS.join(',')}`,
      '-of', 'default=nw=1',
      file,
    ]);
    const tags = {};
    for (const line of stdout.split(/\r?\n/)) {
      const idx = line.indexOf('=');
      if (idx <= 0) continue;
      const key = line.slice(0, idx).toLowerCase().replace(/^tag:/, '');
      const value = line.slice(idx + 1).trim();
      if (value) tags[key] = value;
    }
    return tags;
  } catch {
    return {};
  }
}

