const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Listen to console messages from the page
  page.on('console', msg => {
    console.log(`[PAGE ${msg.type()}] ${msg.text()}`);
  });

  // Listen to page errors
  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err);
  });

  await page.goto('http://localhost:4330/dj/mixes-blog-archive?page=1', {
    waitUntil: 'networkidle'
  });

  // Wait for the search input to be present
  await page.waitForSelector('[data-mix-search]');
  const input = await page.$('[data-mix-search]');

  // Focus and type a test term (we'll use 'house' as it's likely in many titles)
  await input.click();
  await input.fill('house');
  // Wait for debounce (300ms) plus a bit
  await page.waitForTimeout(500);

  // Check if the overlay is visible
  const overlayVisible = await page.evaluate(() => {
    const overlay = document.querySelector('.mix-search-overlay');
    return overlay ? window.getComputedStyle(overlay).display !== 'none' : false;
  });
  console.log('Overlay visible after typing "house":', overlayVisible);

  // If visible, get number of items
  if (overlayVisible) {
    const count = await page.evaluate(() => {
      const items = document.querySelectorAll('.mix-search-item');
      return items.length;
    });
    console.log('Number of search results:', count);
    // Also get first item title
    if (count > 0) {
      const firstText = await page.evaluate(() => {
        const el = document.querySelector('.mix-search-item');
        return el ? el.textContent.trim() : '';
      });
      console.log('First result text:', firstText);
    }
  } else {
    console.log('Overlay not visible; checking if any results were forced hidden');
    // Maybe the search results are injected into the page directly? Not in this implementation.
  }

  // Clear input
  await input.fill('');
  await page.waitForTimeout(300);
  const overlayVisibleAfterClear = await page.evaluate(() => {
    const overlay = document.querySelector('.mix-search-overlay');
    return overlay ? window.getComputedStyle(overlay).display !== 'none' : false;
  });
  console.log('Overlay visible after clearing:', overlayVisibleAfterClear);

  await browser.close();
})();