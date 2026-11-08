export * from './booking.types';
export { bookingContent as bookingContentDe } from './booking.de';
export { bookingContent as bookingContentEn } from './booking.en';

import { bookingContent as bookingContentDe } from './booking.de';
import { bookingContent as bookingContentEn } from './booking.en';
import type { BookingLocale } from './booking.types';

export const bookingContent: Record<BookingLocale, typeof bookingContentDe> = {
  de: bookingContentDe,
  en: bookingContentEn,
};

export const bookingMailto = (lang: BookingLocale): string => {
  const content = bookingContent[lang];
  return `mailto:${content.contact.email}?subject=${encodeURIComponent(content.mail.subject)}&body=${encodeURIComponent(content.mail.body)}`;
};