import faqData from './faqs.json';

export const faqs = faqData.faqs;

export interface Faq {
  id: string;
  question: string;
  answer: string;
  pages: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function getFaqsForPage(pageId: string): FaqItem[] {
  return faqs
    .filter(faq => faq.pages.includes(pageId))
    .map(({ question, answer }) => ({ question, answer }));
}

export function getFaqSchema(pageId: string) {
  const faqsPage = getFaqsForPage(pageId);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqsPage.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}