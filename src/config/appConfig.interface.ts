export interface AppConfig {
  site: {
    name: string;
    description: string;
    url: string;
    logo: string;
    favicon: string;
    contactEmail: string;
    supportPhone: string;
    socialMedia: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
      youtube: string;
    };
    legalInfo: {
      registrationNumber: string;
      taxId: string;
      address: string;
      registeredCharity: boolean;
    };
  };

  features: {
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
  };

  donation: {
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
  };

  auth: {
    loginMethods: string[];
    sessionTimeout: number;
    requireEmailVerification: boolean;
    passwordMinLength: number;
    allowGuestDonations: boolean;
  };

  services: {
    paymentProcessor: string;
    emailProvider: string;
    analyticsProvider: string;
    mapProvider: string;
    storageProvider: string;
  };

  content: {
    language: string;
    supportedLanguages: string[];
    imageOptimization: boolean;
    maxUploadSizeMB: number;
    allowedFileTypes: string[];
  };

  contactForm: {
    recipients: string[];
    subjectPrefix: string;
    receiveAttachments: boolean;
  };
}
