// Simple test to verify our FAQ implementation
const fs = require('faqs');

// Import our FAQs data
const { faqs } = require('./src/data/faqs');
const { getFaqsForPage } = require('./src/lib/faqUtils');

console.log('Testing FAQ implementation...\n');

// Test 1: Get FAQs for index page
console.log('1. FAQs for index page:');
const indexFaqs = getFaqsForPage('index');
console.log(`   Found ${indexFaqs.length} FAQs`);
indexFaqs.forEach(faq => {
  console.log(`   - ${faq.id}: ${faq.question.substring(0, 50)}...`);
});

// Test 2: Get FAQs for vermietung page
console.log('\n2. FAQs for vermietung page:');
const vermietungFaqs = getFaqsForPage('vermietung');
console.log(`   Found ${vermietungFaqs.length} FAQs`);
vermietungFaqs.forEach(faq => {
  console.log(`   - ${faq.id}: ${faq.question.substring(0, 50)}...`);
});

// Test 3: Get FAQs for a specific product page
console.log('\n3. FAQs for jbl-partybox-300-320 page:');
const jblFaqs = getFaqsForPage('jbl-partybox-300-320');
console.log(`   Found ${jblFaqs.length} FAQs`);
jblFaqs.forEach(faq => {
  console.log(`   - ${faq.id}: ${faq.question.substring(0, 50)}...`);
});

// Test 4: Check that the "kurzfristig-anfrage" FAQ appears in all relevant pages
console.log('\n4. Checking "kurzfristig-anfrage" FAQ distribution:');
const kurzfristigFaq = faqs.find(faq => faq.id === 'kurzfristig-anfrage');
if (kurzfristigFaq) {
  console.log(`   Question: ${kurzfristigFaq.question}`);
  console.log(`   Pages: ${JSON.stringify(kurzfristigFaq.pages)}`);
  
  const pagesToCheck = ['index', 'vermietung', 'jbl-partybox-300-320', 'djpaket-fildern'];
  pagesToCheck.forEach(page => {
    const pageFaqs = getFaqsForPage(page);
    const hasFaq = pageFaqs.some(faq => faq.id === 'kurzfristig-anfrage');
    console.log(`   Appears in ${page}: ${hasFaq ? '✓' : '✗'}`);
  });
} else {
  console.log('   ERROR: kurzfristig-anfrage FAQ not found!');
}

console.log('\n✅ FAQ implementation test completed!');