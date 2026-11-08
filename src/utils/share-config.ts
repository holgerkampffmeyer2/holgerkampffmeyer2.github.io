export interface ShareConfigPreset {
  nativeLabel: string;
  whatsappLabel: string;
  facebookLabel: string;
  xLabel: string;
  linkedinLabel: string;
  emailLabel: string;
  pinterestLabel: string;
  redditLabel: string;
  telegramLabel: string;
  copyLabel: string;
  copiedLabel: string;
}

export interface ShareConfig {
  booking: { de: ShareConfigPreset; en: ShareConfigPreset };
  mixDetail: { de: ShareConfigPreset; en: ShareConfigPreset };
  generic: { de: ShareConfigPreset; en: ShareConfigPreset };
}

const deBooking = {
  nativeLabel: 'Teilen',
  whatsappLabel: 'WhatsApp',
  facebookLabel: 'Facebook',
  xLabel: 'X',
  linkedinLabel: 'LinkedIn',
  emailLabel: 'E-Mail',
  pinterestLabel: 'Pinterest',
  redditLabel: 'Reddit',
  telegramLabel: 'Telegram',
  copyLabel: 'Link kopieren',
  copiedLabel: 'Link kopiert',
};

const enBooking = {
  nativeLabel: 'Share',
  whatsappLabel: 'WhatsApp',
  facebookLabel: 'Facebook',
  xLabel: 'X',
  linkedinLabel: 'LinkedIn',
  emailLabel: 'Email',
  pinterestLabel: 'Pinterest',
  redditLabel: 'Reddit',
  telegramLabel: 'Telegram',
  copyLabel: 'Copy link',
  copiedLabel: 'Link copied',
};

const deMixDetail = {
  nativeLabel: 'Teilen',
  whatsappLabel: 'WhatsApp',
  facebookLabel: 'Facebook',
  xLabel: 'X',
  linkedinLabel: 'LinkedIn',
  emailLabel: 'E-Mail',
  pinterestLabel: 'Pinterest',
  redditLabel: 'Reddit',
  telegramLabel: 'Telegram',
  copyLabel: 'Link kopieren',
  copiedLabel: 'Link kopiert',
};

const enMixDetail = {
  nativeLabel: 'Share',
  whatsappLabel: 'WhatsApp',
  facebookLabel: 'Facebook',
  xLabel: 'X',
  linkedinLabel: 'LinkedIn',
  emailLabel: 'Email',
  pinterestLabel: 'Pinterest',
  redditLabel: 'Reddit',
  telegramLabel: 'Telegram',
  copyLabel: 'Copy link',
  copiedLabel: 'Link copied',
};

const deGeneric = {
  nativeLabel: 'Teilen',
  whatsappLabel: 'WhatsApp',
  facebookLabel: 'Facebook',
  xLabel: 'X',
  linkedinLabel: 'LinkedIn',
  emailLabel: 'E-Mail',
  pinterestLabel: 'Pinterest',
  redditLabel: 'Reddit',
  telegramLabel: 'Telegram',
  copyLabel: 'Link kopieren',
  copiedLabel: 'Link kopiert',
};

const enGeneric = {
  nativeLabel: 'Share',
  whatsappLabel: 'WhatsApp',
  facebookLabel: 'Facebook',
  xLabel: 'X',
  linkedinLabel: 'LinkedIn',
  emailLabel: 'Email',
  pinterestLabel: 'Pinterest',
  redditLabel: 'Reddit',
  telegramLabel: 'Telegram',
  copyLabel: 'Copy link',
  copiedLabel: 'Link copied',
};

export const shareConfig: ShareConfig = {
  booking: { de: deBooking, en: enBooking },
  mixDetail: { de: deMixDetail, en: enMixDetail },
  generic: { de: deGeneric, en: enGeneric },
};

export function getShareConfig(
  type: keyof ShareConfig,
  lang: 'de' | 'en'
): ShareConfigPreset {
  return shareConfig[type][lang];
}