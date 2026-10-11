import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = '/mnt/c/work/holgerkampffmeyer2.github.io';

const quality = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'label-url-quality-report.json')));
const proposals = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'label-url-proposals.json'))).proposals;

// Echte Labels unter "suspicious" (False Positives der Heuristik)
const FALSE_POSITIVE_SUSPICIOUS = new Set([
  'Insomniac Records',
  'House of Horatio', 'House Of Horatio',
  'Sonar Depth Records',
  'Non-Friction Records',
  'Jinns and Tonic',
  'Another Rhythm',
  'Shodan Records',
  'kawaii bounce',
  // Diese sind echte Labels auf Bandcamp/Subdomains
]);

// Edeutliche Domain-Parking / Verkauf / Unrelated
const DEFINITELY_BAD = new Set([
  'd:vision', 'Feel Hype', 'GOODSIDE', 'Cat House Records', 'GDB Records',
  'Jackfruit Recordings', 'Black Vinyl Records', 'Sink or Swim', 'Insectorama',
  'SO KOOL', 'Unreleased', 'Whoa!', 'Chakra Records', 'RAW', 'Sound Division',
  'Clavette', 'SOLA', 'TONSPIEL', 'kawaii bounce', 'All Ways Dance',
]);

const likelyLabels = new Set(quality.results.filter(r => r.verdict === 'likely-label').map(r => r.name));
const suspiciousButGood = quality.results.filter(r => r.verdict === 'suspicious' && FALSE_POSITIVE_SUSPICIOUS.has(r.name));
const toKeepNames = new Set([...likelyLabels, ...suspiciousButGood.map(r => r.name)]);

// Baue bereinigte Proposals
const cleaned = proposals.map(p => {
  if (DEFINITELY_BAD.has(p.name)) {
    return { ...p, url: null, via: 'rejected-quality-check', confidence: 0 };
  }
  if (toKeepNames.has(p.name) && p.url) {
    return { ...p, confidence: 0.95, via: 'quality-verified' };
  }
  if (p.verdict === 'suspicious' && !FALSE_POSITIVE_SUSPICIOUS.has(p.name)) {
    return { ...p, url: null, via: 'flagged-suspicious', confidence: 0 };
  }
  return p;
});

const artifact = {
  generatedAt: new Date().toISOString(),
  total: cleaned.length,
  withUrl: cleaned.filter(p => p.url).length,
  proposals: cleaned,
};

fs.writeFileSync(path.join(ROOT_DIR, 'label-url-proposals-cleaned.json'), JSON.stringify(artifact, null, 2) + '\n');
console.log(`Total: ${cleaned.length}`);
console.log(`With URL (verified): ${artifact.withUrl}`);
console.log(`Written: label-url-proposals-cleaned.json`);