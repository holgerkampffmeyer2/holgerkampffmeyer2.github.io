const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capture console logs from the page
  page.on('console', msg => {
    console.log(`[PAGE ${msg.type()}] ${msg.text()}`);
  });

  try {
    await page.goto('http://localhost:4330/dj/mixes-blog-archive?page=1', {
      waitUntil: 'networkidle'
    });

    await page.waitForTimeout(1000);

    // Get the search input
    const input = await page.$('[data-mix-search]');
    if (!input) {
      throw new Error('Search input not found');
    }

    // Test a term
    await input.fill('');
    await input.type('husk'); // something that should match maybe
    await page.waitForTimeout(500); // wait for debounce

    // Additional small wait
    await page.waitForTimeout(500);

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
})();