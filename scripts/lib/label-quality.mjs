export const MUSIC_KEYWORDS = [
  'record', 'label', 'music', 'records', 'recording', 'release', 'artist',
  'vinyl', 'digital', 'streaming', 'beatport', 'bandcamp', 'soundcloud',
  'spotify', 'apple music', 'distribution', 'publishing', 'royalties',
  'demo', 'submit', 'contact', 'booking', 'management', 'events',
  'shop', 'store', 'merch', 'news', 'blog', 'bio', 'about us',
  'imprint', 'sublabel', 'catalog', 'discography', 'releases',
];

export const NEGATIVE_KEYWORDS = [
  'domain for sale', 'buy this domain', 'parked', 'godaddy', 'sedo',
  'afternic', 'hugedomains', 'namecheap', 'premium domain',
  'make an offer', 'inquire about', 'domain marketplace',
  'this domain is for sale', 'expired domain', 'coming soon',
  'under construction', 'default web site', 'nginx', 'apache2',
  'iis windows server', 'test page', 'placeholder',
  'real estate', 'immobilien', 'finanz', 'insurance', 'versicherung',
  'lawyer', 'anwalt', 'dentist', 'zahnarzt', 'restaurant',
  'hotel', 'travel', 'reise',
];

export function extractText(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

export function analyzeContent(url, html, finalUrl) {
  const text = extractText(html);
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].toLowerCase() : '';
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const description = descMatch ? descMatch[1].toLowerCase() : '';

  const searchText = `${title} ${description} ${text.slice(0, 5000)}`;

  let musicScore = 0;
  let negativeScore = 0;
  const foundMusic = [];
  const foundNegative = [];

  for (const kw of MUSIC_KEYWORDS) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(searchText)) {
      musicScore++;
      foundMusic.push(kw);
    }
  }
  for (const kw of NEGATIVE_KEYWORDS) {
    if (searchText.includes(kw.toLowerCase())) {
      negativeScore++;
      foundNegative.push(kw);
    }
  }

  const textLength = text.length;
  const hasSubstantialContent = textLength > 500;

  let verdict = 'unknown';
  if (negativeScore > 0) verdict = 'suspicious';
  else if (musicScore >= 3 && hasSubstantialContent) verdict = 'likely-label';
  else if (musicScore >= 1 && hasSubstantialContent) verdict = 'possible';
  else if (!hasSubstantialContent) verdict = 'thin-content';
  else verdict = 'unclear';

  return {
    url,
    finalUrl,
    verdict,
    musicScore,
    negativeScore,
    foundMusic: [...new Set(foundMusic)].slice(0, 10),
    foundNegative,
    textLength,
    title: title.slice(0, 120),
  };
}
