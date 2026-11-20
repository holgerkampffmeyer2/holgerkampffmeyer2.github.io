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

const deLabels: ShareConfigPreset = {
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

const enLabels: ShareConfigPreset = {
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
  booking: { de: { ...deLabels }, en: { ...enLabels } },
  mixDetail: { de: { ...deLabels }, en: { ...enLabels } },
  generic: { de: { ...deLabels }, en: { ...enLabels } },
};
