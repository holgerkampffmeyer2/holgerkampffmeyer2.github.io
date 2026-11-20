import { describe, it, expect } from 'vitest';
import { renderMobileTracklist } from '../tracklist-renderer';
import type { TrackLabelResolver } from '../mix-track-data';

const resolver = {
  get(track) {
    return track === 'Artist - Track'
      ? { id: 'label', name: 'Label <script> "x"', url: 'https://example.com/?a=1&b="2"' }
      : null;
  },
  hasAny(tracks) {
    return tracks.some((track) => this.get(track) !== null);
  },
} satisfies TrackLabelResolver;

describe('renderMobileTracklist', () => {
  it('escapes track and label values in the generated HTML', () => {
    const html = renderMobileTracklist(['Artist - Track'], true, resolver);

    expect(html).not.toContain('<script>');
    expect(html).toContain('Label &lt;script&gt; &quot;x&quot;');
    expect(html).toContain('href="https://example.com/?a=1&amp;b=&quot;2&quot;"');
  });

  it('omits labels when showLabel is false', () => {
    const html = renderMobileTracklist(['Artist - Track'], false, resolver);
    expect(html).not.toContain('Label &lt;script&gt;');
  });

  it('renders all tracks once', () => {
    const html = renderMobileTracklist(['One - A', 'Two - B'], false, {
      get: () => null,
      hasAny: () => false,
    });
    expect(html.match(/class="flex flex-col gap-1/g)).toHaveLength(2);
  });
});
