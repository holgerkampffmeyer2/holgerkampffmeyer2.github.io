import faqData from './faqs.json';

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
  return faqData.faqs
    .filter(faq => faq.pages.includes(pageId))
    .map(({ question, answer }) => ({ question, answer }));
}

export function getFaqSchema(pageId: string) {
  const faqs = getFaqsForPage(pageId);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}