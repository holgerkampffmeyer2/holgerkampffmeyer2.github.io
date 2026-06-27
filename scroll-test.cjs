const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the URL
    await page.goto('http://localhost:4330/dj/mixes-blog-archive?page=1', {
      waitUntil: 'networkidle'
    });
    
    // Wait a bit for any potential JS scrolling
    await page.waitForTimeout(1000);
    
    // Get the current scroll position
    const scrollY = await page.evaluate(() => window.scrollY);
    
    console.log(`Initial scroll position: ${scrollY}px`);
    
    // Check if page scrolled down (not at top)
    if (scrollY > 0) {
      console.log('✓ PAGE SCROLLED DOWN: Page starts scrolled down (not at top)');
    } else {
      console.log('✗ PAGE AT TOP: Page starts at the top (scroll position 0)');
    }
    
    // Optional: Check if there's any scrollable content
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    console.log(`Page height: ${bodyHeight}px, Viewport: ${viewportHeight}px`);
    console.log(`Can scroll: ${bodyHeight > viewportHeight}`);
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
  }
})();