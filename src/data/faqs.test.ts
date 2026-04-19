import { describe, expect, it, vi } from 'vitest';

// Mock the faqs.json file
vi.mock('./faqs.json', () => {
  return {
    default: {
      faqs: [
        {
          id: '1',
          question: 'What is the return policy?',
          answer: 'You can return items within 30 days.',
          pages: ['index', 'vermietung']
        },
        {
          id: '2',
          question: 'How to contact support?',
          answer: 'Email us at support@example.com.',
          pages: ['vermietung']
        },
        {
          id: '3',
          question: 'What are the opening hours?',
          answer: 'We are open 9am to 6pm.',
          pages: ['index']
        }
      ]
    }
  };
});

// Now import the module we want to test
import { getFaqsForPage, getFaqSchema, faqs } from './faqs';

describe('faqs module', () => {
  it('should export the faqs array', () => {
    expect(faqs).toEqual([
      {
        id: '1',
        question: 'What is the return policy?',
        answer: 'You can return items within 30 days.',
        pages: ['index', 'vermietung']
      },
      {
        id: '2',
        question: 'How to contact support?',
        answer: 'Email us at support@example.com.',
        pages: ['vermietung']
      },
      {
        id: '3',
        question: 'What are the opening hours?',
        answer: 'We are open 9am to 6pm.',
        pages: ['index']
      }
    ]);
  });

  describe('getFaqsForPage', () => {
    it('should return faqs for the given page', () => {
      const indexFaqs = getFaqsForPage('index');
      expect(indexFaqs).toHaveLength(2);
      expect(indexFaqs[0].question).toBe('What is the return policy?');
      expect(indexFaqs[1].question).toBe('What are the opening hours?');

      const vermietungFaqs = getFaqsForPage('vermietung');
      expect(vermietungFaqs).toHaveLength(2);
      expect(vermietungFaqs[0].question).toBe('What is the return policy?');
      expect(vermietungFaqs[1].question).toBe('How to contact support?');
    });

    it('should return an empty array for a page with no faqs', () => {
      const unknownFaqs = getFaqsForPage('unknown');
      expect(unknownFaqs).toHaveLength(0);
    });
  });

  describe('getFaqSchema', () => {
    it('should return a valid FAQPage schema', () => {
      const schema = getFaqSchema('index');
      expect(schema).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'FAQPage'
      });
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0]).toMatchObject({
        '@type': 'Question',
        'name': 'What is the return policy?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You can return items within 30 days.'
        }
      });
    });
  });
});