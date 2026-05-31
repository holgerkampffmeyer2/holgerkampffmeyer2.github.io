export function getMixDisplay(key, title) {
  const slug = key.split('/').filter(Boolean).pop()
  let match = slug.match(/\b(?:mx|mix)[^\d]*(\d+)/i)
  const mixNum = match?.[1] ?? title.match(/#\s*(\d+)/)?.[1] ?? null

  if (!mixNum) {
    return { label: truncateLabel(title), mixNum: null }
  }

  let desc = slug
    .replace(/^dj-hulk-?/i, '')
    .replace(/\b(?:mx|mix)[^\d]*\d+\s*-?\s*/i, '')
    .replace(/^[-\s]+|[-\s]+$/g, '')
    .replace(/\bby\b\s*(?:dj\s*hulk)?\s*/i, '')
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!match) {
    desc = desc.replace(/\d[\d\s]*$/, '').trim()
  }

  let readable = desc
    ? desc.replace(/\b\w/g, c => c.toUpperCase())
    : ''

  if (!readable || readable.length < 3) {
    readable = title
      .replace(/^DJ\s+Hulk\s*[-–]\s*/i, '')
      .replace(/\s*[-–]\s*Mix\s*#?\d+/i, '')
      .replace(/Mix\s*#?\d+\s*/i, '')
      .replace(/\s+by\s+DJ\s+Hulk\s*$/i, '')
      .trim()
  }

  const label = readable
    ? `Mix#${mixNum} – ${readable}`
    : `Mix#${mixNum}`

  return { label: truncateLabel(label), mixNum }
}

function truncateLabel(str, maxLen = 30) {
  if (str.length <= maxLen) return str
  const cut = str.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  if (lastSpace < 1) return cut.slice(0, maxLen - 1) + '…'
  return cut.slice(0, lastSpace) + '…'
}
