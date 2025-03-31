import { AppConfig } from "./appConfig.interface";

/**
 * Cấu hình ứng dụng
 */
const appConfig: AppConfig = {
  site: {
    name: "Zero GiveAway",
    description:
      "Cho đi không phải vì người khác cần, mà vì ta hiểu rằng yêu thương là thứ duy nhất càng cho đi càng đầy ắp.",
    url: "https://zerogiveaway.org",
    logo: "/images/logo.svg",
    favicon: "/favicon.ico",
    contactEmail: "contact@zerogiveaway.org",
    supportPhone: "+84 833 216 274",
    socialMedia: {
      facebook: "https://facebook.com/zerogiveaway",
      twitter: "https://twitter.com/zerogiveaway",
      instagram: "https://instagram.com/zerogiveaway",
      linkedin: "https://linkedin.com/company/zerogiveaway",
      youtube: "https://youtube.com/c/zerogiveaway",
    },
    legalInfo: {
      registrationNumber: "QT-123456789",
      taxId: "123456789-0",
      address: "123 Đường Từ Thiện, Quận T, TP. Hồ Chí Minh",
      registeredCharity: true,
    },
  },

  features: {
    enableDonations: true,
    enableRecurringDonations: true,
    enableVolunteerRegistration: true,
    enableBlogPosts: true,
    enableEventRegistration: true,
    enableDonorDashboard: true,
    enableCampaignCreation: true,
    enableNewsletter: true,
    enableTestimonials: true,
    enableImpactStats: true,
    enableDarkMode: true,
  },

  donation: {
    minimumAmount: 10000,
    suggestedAmounts: [50000, 100000, 200000, 500000],
    currencies: ["VND", "USD"],
    defaultCurrency: "VND",
    paymentMethods: [
      "credit_card",
      "paypal",
      "momo",
      "vn_pay",
      "bank_transfer",
    ],
    processingFee: 2.9,
    coverFeeOption: true,
    taxDeductible: true,
    receiptEnabled: true,
    thankYouEmails: true,
  },

  auth: {
    loginMethods: ["email", "google", "facebook"],
    sessionTimeout: 30,
    requireEmailVerification: true,
    passwordMinLength: 8,
    allowGuestDonations: true,
  },

  services: {
    paymentProcessor: "Stripe",
    emailProvider: "SendGrid",
    analyticsProvider: "GoogleAnalytics",
    mapProvider: "GoogleMaps",
    storageProvider: "AWS",
  },

  content: {
    language: "vi",
    supportedLanguages: ["vi", "en"],
    imageOptimization: true,
    maxUploadSizeMB: 5,
    allowedFileTypes: ["image/png", "image/jpeg", "application/pdf"],
  },

  contactForm: {
    recipients: ["contact@zerogiveaway.org"],
    subjectPrefix: "[Zero GiveAway]",
    receiveAttachments: true,
  },
};

export default appConfig;
