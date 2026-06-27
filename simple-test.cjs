const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4330/dj/mixes-blog-archive?page=1', { waitUntil: 'networkidle' });
  const title = await page.title();
  console.log('Page title:', title);
  await browser.close();
})();