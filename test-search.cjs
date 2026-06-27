const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Go to the page
    await page.goto('http://localhost:4330/dj/mixes-blog-archive?page=1', {
      waitUntil: 'networkidle'
    });

    // Wait for the mix search data to be present
    await page.waitForFunction(() => {
      const script = document.getElementById('mixSearchData');
      return script && script.textContent.trim().length > 0;
    });

    // Extract some sample search terms from the data
    const sampleTerms = await page.evaluate(() => {
      const script = document.getElementById('mixSearchData');
      if (!script) return [];
      try {
        const data = JSON.parse(script.textContent);
        // Take first few titles and split into words
        const words = new Set();
        data.slice(0, 5).forEach(item => {
          const title = (item.title || '').toLowerCase();
          title.split(/\s+/).forEach(w => {
            if (w.length > 3) words.add(w);
          });
        });
        return Array.from(words).slice(0, 3);
      } catch (e) {
        console.error('Failed to parse search data:', e);
        return [];
      }
    });

    console.log('Sample terms to test:', sampleTerms);

    // Get the search input
    const input = await page.$('[data-mix-search]');
    if (!input) {
      throw new Error('Search input not found');
    }

    for (const term of sampleTerms) {
      console.log(`Testing term: "${term}"`);
      await input.fill('');
      await input.type(term);
      // Wait for debounce (300ms) + some extra
      await page.waitForTimeout(400);

      // Check if overlay is visible and has results
      const overlayVisible = await page.evaluate(() => {
        const overlay = document.querySelector('.mix-search-overlay');
        return overlay && overlay.style.display !== 'none';
      });

      let resultCount = 0;
      if (overlayVisible) {
        resultCount = await page.evaluate(() => {
          const items = document.querySelectorAll('.mix-search-item');
          return items.length;
        });
      }

      // Also check if any post items are displayed (should be filtered)
      const visiblePosts = await page.evaluate(() => {
        const posts = document.querySelectorAll('.post-item');
        let visible = 0;
        posts.forEach(p => {
          if (window.getComputedStyle(p).display !== 'none') visible++;
        });
        return visible;
      });

      console.log(`  Overlay visible: ${overlayVisible}, overlay results: ${resultCount}, visible posts: ${visiblePosts}`);

      // Clear input for next iteration
      await input.fill('');
      await page.waitForTimeout(100);
    }

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
})();