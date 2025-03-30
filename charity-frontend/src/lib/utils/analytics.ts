/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/utils/analytics.ts

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

interface PageView {
  path: string;
  title?: string;
}

/**
 * Analytics wrapper that can be implemented with
 * Google Analytics, Mixpanel, or other services
 */
const analytics = {
  /**
   * Track pageview
   */
  trackPageView({ path, title }: PageView): void {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") return;

    try {
      // Example implementation for Google Analytics
      if (window.gtag) {
        window.gtag("config", process.env.NEXT_PUBLIC_GA_ID as string, {
          page_path: path,
          page_title: title,
        });
      }

      // Additional analytics implementations can be added here
      console.log(`[Analytics] Pageview: ${path}`);
    } catch (error) {
      console.error("[Analytics] Failed to track pageview", error);
    }
  },

  /**
   * Track event
   */
  trackEvent({
    category,
    action,
    label,
    value,
    nonInteraction = false,
  }: AnalyticsEvent): void {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") return;

    try {
      // Example implementation for Google Analytics
      if (window.gtag) {
        window.gtag("event", action, {
          event_category: category,
          event_label: label,
          value,
          non_interaction: nonInteraction,
        });
      }

      // Additional analytics implementations can be added here
      console.log(`[Analytics] Event: ${category} - ${action} - ${label}`);
    } catch (error) {
      console.error("[Analytics] Failed to track event", error);
    }
  },

  /**
   * Track donation
   */
  trackDonation(amount: number, currency: string, campaignId?: string): void {
    this.trackEvent({
      category: "Donation",
      action: "Complete",
      label: campaignId || "General",
      value: amount,
    });

    // For e-commerce tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: `DON${Date.now()}`,
        value: amount,
        currency,
        items: [
          {
            id: campaignId || "general-donation",
            name: campaignId ? "Campaign Donation" : "General Donation",
            category: "Donation",
            quantity: 1,
            price: amount,
          },
        ],
      });
    }

    console.log(`[Analytics] Donation tracked: ${amount} ${currency}`);
  },

  /**
   * Track volunteer registration
   */
  trackVolunteerRegistration(userId: string): void {
    this.trackEvent({
      category: "Volunteer",
      action: "Register",
      label: userId,
    });
  },

  /**
   * Track event registration
   */
  trackEventRegistration(eventId: string, eventName: string): void {
    this.trackEvent({
      category: "Event",
      action: "Register",
      label: eventName,
    });
  },

  /**
   * Track form submission
   */
  trackFormSubmission(formName: string): void {
    this.trackEvent({
      category: "Form",
      action: "Submit",
      label: formName,
    });
  },

  /**
   * Track error
   */
  trackError(errorType: string, errorMessage: string): void {
    this.trackEvent({
      category: "Error",
      action: errorType,
      label: errorMessage,
      nonInteraction: true,
    });
  },

  /**
   * Track social share
   */
  trackSocialShare(platform: string, contentId: string): void {
    this.trackEvent({
      category: "Social",
      action: "Share",
      label: `${platform} - ${contentId}`,
    });
  },
};

// Add type definition for window
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any> | string
    ) => void;
  }
}

export default analytics;
