// lib/utils/socialSharing.ts

interface ShareData {
  title: string;
  text?: string;
  url: string;
  hashtags?: string[];
  via?: string;
}

/**
 * Utility for social media sharing
 */
const socialSharing = {
  /**
   * Share using the browser's native Web Share API if available
   * Falls back to opening a share window for the specified platform
   */
  async share(
    data: ShareData,
    fallbackPlatform: string = "twitter"
  ): Promise<boolean> {
    // Check if Web Share API is available
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url,
        });
        return true;
      } catch (error) {
        console.error("Error using Web Share API:", error);
        // Fall back to platform-specific sharing
        return this.shareTo(fallbackPlatform, data);
      }
    }

    // Web Share API not available, use fallback
    return this.shareTo(fallbackPlatform, data);
  },

  /**
   * Share to a specific platform
   */
  shareTo(platform: string, data: ShareData): boolean {
    let shareUrl = "";
    const { url, title, text, hashtags = [], via } = data;

    switch (platform.toLowerCase()) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}&quote=${encodeURIComponent(text || title)}`;
        break;

      case "twitter":
      case "x":
        shareUrl =
          "https://twitter.com/intent/tweet?" +
          `text=${encodeURIComponent(text || title)}` +
          `&url=${encodeURIComponent(url)}` +
          (hashtags.length
            ? `&hashtags=${encodeURIComponent(hashtags.join(","))}`
            : "") +
          (via ? `&via=${encodeURIComponent(via)}` : "");
        break;

      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;

      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${title} ${url}`
        )}`;
        break;

      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text || title)}`;
        break;

      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(`${text || ""}\n\n${url}`)}`;
        break;

      default:
        console.warn(`Sharing to ${platform} is not supported`);
        return false;
    }

    if (shareUrl) {
      // Open share dialog
      window.open(
        shareUrl,
        "_blank",
        "width=600,height=400,resizable=yes,scrollbars=yes"
      );
      return true;
    }

    return false;
  },

  /**
   * Generate a complete share data object for a campaign
   */
  prepareCampaignShareData(campaign: {
    id: string;
    title: string;
    shortDescription?: string;
  }): ShareData {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return {
      title: campaign.title,
      text:
        campaign.shortDescription || `Support our campaign: ${campaign.title}`,
      url: `${baseUrl}/campaigns/${campaign.id}`,
      hashtags: ["charity", "donation", "support"],
      via: "YourCharityHandle",
    };
  },

  /**
   * Generate a complete share data object for an event
   */
  prepareEventShareData(event: {
    id: string;
    title: string;
    description?: string;
    location?: string;
    startDate?: string;
  }): ShareData {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    let text = `Join us for: ${event.title}`;
    if (event.location) text += ` at ${event.location}`;
    if (event.startDate) {
      const date = new Date(event.startDate);
      text += ` on ${date.toLocaleDateString()}`;
    }

    return {
      title: event.title,
      text,
      url: `${baseUrl}/events/${event.id}`,
      hashtags: ["charity", "event", "volunteer"],
      via: "YourCharityHandle",
    };
  },

  /**
   * Copy content to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  },
};

export default socialSharing;
