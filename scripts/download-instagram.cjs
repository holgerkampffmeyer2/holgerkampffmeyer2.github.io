const { chromium } = require('playwright');
const fs = require('fs');
const https = require('https');

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(filename, () => reject(err));
    });
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set a realistic user agent
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  try {
    await page.goto('https://www.instagram.com/p/DerGyo-t4Cb/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait a bit for any dynamic content
    await page.waitForTimeout(3000);
    
    // Try multiple selectors
    const imageUrl = await page.evaluate(() => {
      // Try article img first
      let images = document.querySelectorAll('article img');
      if (images.length > 0) {
        let maxArea = 0;
        let mainImg = null;
        images.forEach(img => {
          const area = img.naturalWidth * img.naturalHeight;
          if (area > maxArea) {
            maxArea = area;
            mainImg = img;
          }
        });
        if (mainImg) return mainImg.src;
      }
      
      // Try all img tags
      images = document.querySelectorAll('img');
      let maxArea = 0;
      let mainImg = null;
      images.forEach(img => {
        const area = img.naturalWidth * img.naturalHeight;
        if (area > maxArea && img.src.includes('cdninstagram')) {
          maxArea = area;
          mainImg = img;
        }
      });
      return mainImg ? mainImg.src : null;
    });
    
    if (imageUrl) {
      console.log('Found image:', imageUrl);
      const filename = 'Cugga B2B Hulk - Oct 2026.jpg';
      await downloadImage(imageUrl, filename);
      console.log('Downloaded as:', filename);
    } else {
      console.log('No image found, dumping page HTML for debugging...');
      const html = await page.content();
      fs.writeFileSync('debug-page.html', html);
      console.log('Page saved to debug-page.html');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  await browser.close();
})();
