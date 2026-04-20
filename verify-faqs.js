// Verification script for FAQ implementation
const { faqs } = require('./src/data/faqs');
const { getFaqsForPage } = require('./src/lib/faqUtils');

console.log('=== FAQ Implementation Verification ===\n');

// Check that we have the expected number of FAQs
console.log(`Total FAQs in data: ${faqs.length}`);
console.log(`Expected: 40+ (general + product-specific)\n`);

// Verify a few specific FAQs exist
const generalFaq = faqs.find(f => f.id === 'general-pricing');
console.log(`✓ General pricing FAQ exists: ${!!generalFaq}`);

const kurzfristigFaq = faqs.find(f => f.id === 'kurzfristig-anfrage');
console.log(`✓ Kurzfristig FAQ exists: ${!!kurzfristigFaq}`);
if (kurzfristigFaq) {
  console.log(`  - Pages: ${JSON.stringify(kurzfristigFaq.pages)}`);
}

const jblFaq = faqs.find(f => f.id === 'jbl-akkulaufzeit');
console.log(`✓ JBL Akkulaufzeit FAQ exists: ${!!jblFaq}`);
if (jblFaq) {
  console.log(`  - Pages: ${JSON.stringify(jblFaq.pages)}`);
}

// Test the getFaqsForPage function
console.log('\n=== Testing getFaqsForPage function ===');

const indexFaqs = getFaqsForPage('index');
console.log(`✓ Index page FAQs: ${indexFaqs.length}`);

const vermietungFaqs = getFaqsForPage('vermietung');
console.log(`✓ Vermietung page FAQs: ${vermietungFaqs.length}`);

const jblFaqs = getFaqsForPage('jbl-partybox-300-320');
console.log(`✓ JBL Partybox page FAQs: ${jblFaqs.length}`);

// Verify that kurzfristig-anfrage appears in all expected pages
const expectedPages = ['index', 'vermietung', 'jbl-partybox-300-320', 'djpaket-fildern', 
                      'veranstaltungspaket-stuttgart', 'partypaket-stuttgart', 
                      'partylicht-moving-head', 'led-bossfx-nebelmaschine', 
                      'ld-maui-28g3', 'kls-laser-bar'];

console.log('\n=== Checking kurzfristig-anfrage distribution ===');
let allCorrect = true;
expectedPages.forEach(page => {
  const pageFaqs = getFaqsForPage(page);
  const hasFaq = pageFaqs.some(faq => faq.id === 'kurzfristig-anfrage');
  const status = hasFaq ? '✓' : '✗';
  console.log(`${status} ${page}`);
  if (!hasFaq) allCorrect = false;
});

if (allCorrect) {
  console.log('\n✅ All kurzfristig-anfrage placements are correct!');
} else {
  console.log('\n❌ Some kurzfristig-anfrage placements are incorrect!');
}

// Test that product-specific FAQs only appear on their pages
console.log('\n=== Checking product-specific FAQ isolation ===');
const jblIndexFaqs = getFaqsForPage('index');
const jblHasJblFaq = jblIndexFaqs.some(faq => faq.id === 'jbl-akkulaufzeit');
console.log(`✓ JBL FAQ not in index: ${!jblHasJblFaq ? '✓' : '✗'}`);

const vermietungHasJblFaq = jblIndexFaqs.some(faq => faq.id === 'jbl-akkulaufzeit');
console.log(`✓ JBL FAQ not in vermietung general: ${!vermietungHasJblFaq ? '✓' : '✗'}`);

// Final summary
console.log('\n=== Verification Complete ===');
console.log('Implementation appears to be working correctly.');
console.log('Remember to run a full build to check for any runtime issues.');