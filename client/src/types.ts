export interface SiteTheme {
  accent: string;
  secondary: string;
  surfaceDark: string;
  badgeText: string;
}

export interface SiteConfig {
  presetKey: string;
  brandName: string;
  eventTitle: string;
  tagline: string;
  location: string;
  dates: string;
  openingHours: string;
  heroHeadline: string;
  heroSubheadline: string;
  theme: SiteTheme;
}

export interface ChaletTraderPreview {
  id: string;
  businessName: string;
  category: string;
  description: string;
  signatureItem: string;
}

export interface Chalet {
  code: string;
  zone: string;
  category: string;
  size: string;
  fee: number;
  utilities: string[];
  x: number;
  y: number;
  status: 'available' | 'pending' | 'booked';
  trader?: ChaletTraderPreview | null;
}

export interface Trader {
  id: string;
  referenceCode?: string;
  businessName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  category: string;
  chaletCode: string;
  description: string;
  signatureItem: string;
  hygieneCertified: boolean;
  publicLiabilityInsurance?: boolean;
  gdprConsent?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export type ActiveTab = 'discover' | 'apply' | 'admin' | 'gdpr';
