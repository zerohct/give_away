// lib/config/appConfig.interface.ts

/**
 * Định nghĩa interface cho cấu hình ứng dụng
 */
export interface SiteInfo {
  name: string;
  description: string;
  url: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  supportPhone: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  legalInfo: {
    registrationNumber: string;
    taxId: string;
    address: string;
    registeredCharity: boolean;
  };
}

export interface Features {
  enableDonations: boolean;
  enableRecurringDonations: boolean;
  enableVolunteerRegistration: boolean;
  enableBlogPosts: boolean;
  enableEventRegistration: boolean;
  enableDonorDashboard: boolean;
  enableCampaignCreation: boolean;
  enableNewsletter: boolean;
  enableTestimonials: boolean;
  enableImpactStats: boolean;
  enableDarkMode: boolean;
}

export interface DonationSettings {
  minimumAmount: number;
  suggestedAmounts: number[];
  currencies: string[];
  defaultCurrency: string;
  paymentMethods: string[];
  processingFee: number;
  coverFeeOption: boolean;
  taxDeductible: boolean;
  receiptEnabled: boolean;
  thankYouEmails: boolean;
}

export interface AuthSettings {
  loginMethods: ("email" | "google" | "facebook")[];
  sessionTimeout: number; // in minutes
  requireEmailVerification: boolean;
  passwordMinLength: number;
  allowGuestDonations: boolean;
}

export interface ExternalServices {
  paymentProcessor: string;
  emailProvider: string;
  analyticsProvider: string;
  mapProvider: string;
  storageProvider: string;
}

export interface ContentSettings {
  language: string;
  supportedLanguages: string[];
  imageOptimization: boolean;
  maxUploadSizeMB: number;
  allowedFileTypes: string[];
}

export interface ContactFormSettings {
  recipients: string[];
  subjectPrefix: string;
  receiveAttachments: boolean;
}

export interface AppConfig {
  site: SiteInfo;
  features: Features;
  donation: DonationSettings;
  auth: AuthSettings;
  services: ExternalServices;
  content: ContentSettings;
  contactForm: ContactFormSettings;
}
