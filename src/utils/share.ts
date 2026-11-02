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
  pinterest: string;
  reddit: string;
  telegram: string;
}

export interface MailtoInput {
  to: string;
  subject: string;
  body: string;
}

export function buildShareLinks({ url, title, text, hashtags }: ShareInput): ShareLinks {
  const encodedUrl = encodeURIComponent(url);
  const shareText = `${text} ${url}`.trim();
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(title);
  const encodedHashtags = hashtags ? encodeURIComponent(hashtags) : '';

  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`;
  const redditUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

  const xUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}${encodedHashtags ? `&hashtags=${encodedHashtags}` : ''}`;

  return {
    whatsapp: `https://wa.me/?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: xUrl,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
    pinterest: pinterestUrl,
    reddit: redditUrl,
    telegram: telegramUrl,
  };
}

export function buildMailto({ to, subject, body }: MailtoInput): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildWhatsAppMessage(phone: string, text: string): string {
  const normalizedPhone = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text)}`;
}
