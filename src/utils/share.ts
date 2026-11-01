export interface ShareInput {
  url: string;
  title: string;
  text: string;
  hashtags?: string;
}

export interface ShareLinks {
  whatsapp: string;
  facebook: string;
  x: string;
  linkedin: string;
  email: string;
}

export interface MailtoInput {
  to: string;
  subject: string;
  body: string;
}

export function buildShareLinks({ url, title, text, hashtags = '' }: ShareInput): ShareLinks {
  const encodedUrl = encodeURIComponent(url);
  const shareText = `${text} ${url}`.trim();
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(title);
  const hashtagParam = hashtags ? `&hashtags=${encodeURIComponent(hashtags)}` : '';

  return {
    whatsapp: `https://wa.me/?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}${hashtagParam}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
  };
}

export function buildMailto({ to, subject, body }: MailtoInput): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildWhatsAppMessage(phone: string, text: string): string {
  const normalizedPhone = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text)}`;
}
