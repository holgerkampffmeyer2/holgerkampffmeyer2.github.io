
import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const REVIEWS_FILE_PATH = path.resolve(process.cwd(), 'src/data/google-reviews.json');
const GOOGLE_URL = 'https://www.google.com/search?rlz=1C1UEAD_enDE1115DE1115&sca_esv=8a0da9cb61e79fc9&sxsrf=ANbL-n6gGx-pVrorBaHGK5AEgqafDI2OKQ:1775310489172&q=holger+kampffmeyer+dj+dienstleistungen&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQiu2Rk9jl1B9g8G3EOedqydBq8d6KYqxohr39zohT-Exc5qqU0f9RPNQHItsFETkyzES3k%3D&uds=ALYpb_mAD8_sxmf7ymI16UFg8sxybCC2B9rdFSOE19ciRWCdruyBpNWir2xkv_C5Mm2gGCgoN0KlSpOUb3CuGDqyAbnYVdn3AIvKp25eAELRVnZozltIADr0f2WtR5Uo9hjYR1vHnzdllh1KGVEpIDJcFuItND35Iw&sa=X&sqi=2&ved=2ahUKEwiYuMr4qtSTAxXqRfEDHRcmM3oQ3PALegQIGRAE&biw=2048&bih=972&dpr=0.94';

async function fetchGoogleReviews() {
  console.log('Starting Playwright to fetch Google Reviews...');
  
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      locale: 'de-DE',
      timezoneId: 'Europe/Berlin',
    });
    const page = await context.newPage();

    // Capture console logs from the browser
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    await page.goto(GOOGLE_URL, { waitUntil: 'networkidle', timeout: 60000 });

    // Wait a bit more for dynamic content
    await page.waitForTimeout(5000);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-google-reviews.png' });
    console.log('Screenshot saved to debug-google-reviews.png');

    // Try to find review section
    const reviewSection = await page.$('div[data-review-id], .gws-local-reviews__card, .review-dialog-list, [class*="review"]');
    if (!reviewSection) {
      console.log('No review section found. Page content:');
      const content = await page.content();
      console.log(content.substring(0, 2000)); // Log first 2000 chars
    }

    const reviews = await page.evaluate(() => {
      const results = [];
      
      // Try multiple selectors to find reviews
      const selectors = [
        '.gws-local-reviews__review-anchor',
        '.review-dialog-list > div',
        'div[data-review-id]',
        '.font-body-medium',
        '.Y0aCkf' // Another potential container
      ];

      let reviewElements = [];
      for (const sel of selectors) {
        const found = document.querySelectorAll(sel);
        if (found.length > 0) {
          reviewElements = Array.from(found);
          console.log(`Found ${found.length} elements with selector: ${sel}`);
          break;
        }
      }

      reviewElements.forEach((el, index) => {
        const text = el.textContent?.trim();
        // Filter out very short texts or navigation elements
        if (text && text.length > 20 && !text.includes('Anfragen') && !text.includes('Suche') && !text.includes('Maps')) {
           // Try to find author
           const authorEl = el.querySelector('.font-title-medium, [class*="author"], [class*="name"], span:first-child');
           const ratingEl = el.querySelector('[aria-label*="Stern"], [aria-label*="stars"], [class*="rating"]');
           
           let rating = 5;
           if (ratingEl) {
             const ariaLabel = ratingEl.getAttribute('aria-label');
             if (ariaLabel) {
               // Match numbers in aria-label (e.g., "5 Sterne")
               const match = ariaLabel.match(/(\d+)/);
               if (match) rating = parseInt(match[1], 10);
             }
           }

           results.push({
             author_name: authorEl ? authorEl.textContent.trim().split('\n')[0] : `Review ${index + 1}`,
             rating: rating,
             text: text.substring(0, 500),
             relative_time_description: 'Recently'
           });
        }
      });
      return results;
    });

    console.log(`Found ${reviews.length} potential reviews.`);
    await fs.writeFile(REVIEWS_FILE_PATH, JSON.stringify({ reviews }, null, 2), 'utf-8');
    console.log(`Saved reviews to ${REVIEWS_FILE_PATH}`);

  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
  } finally {
    if (browser) await browser.close();
  }
}

fetchGoogleReviews();
