/**
 * Get optimized image URL (assuming use of a CDN like Cloudinary)
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "jpg" | "png";
    crop?: "fill" | "fit" | "limit" | "pad" | "scale";
  } = {}
): string {
  // Return placeholder if no image URL
  if (!imageUrl) {
    return "/images/placeholder.jpg";
  }

  // If not a remote URL (e.g., already a local path or data URL), return as is
  if (!imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // If using Cloudinary or similar service, construct the URL
  // This is a simplified example - adjust according to your CDN
  try {
    const cloudinaryPrefix =
      "https://res.cloudinary.com/your-charity-account/image/upload/";

    // Handle images that are already on Cloudinary
    if (imageUrl.includes("cloudinary.com")) {
      // Extract base path without transformations
      const parts = imageUrl.split("/upload/");
      if (parts.length === 2) {
        const basePath = parts[1];
        let transformations = "f_auto,q_auto";

        if (options.width) transformations += `,w_${options.width}`;
        if (options.height) transformations += `,h_${options.height}`;
        if (options.quality) transformations += `,q_${options.quality}`;
        if (options.crop) transformations += `,c_${options.crop}`;
        if (options.format && options.format !== "auto")
          transformations += `,f_${options.format}`;

        return `${cloudinaryPrefix}${transformations}/${basePath}`;
      }
    }

    // For non-Cloudinary URLs, you might return as-is or implement conversion logic
    return imageUrl;
  } catch (error) {
    console.error("Error optimizing image:", error);
    return imageUrl;
  }
}

/**
 * Get avatar URL with fallback
 */
export function getAvatarUrl(
  avatarUrl: string | undefined,
  name: string,
  size: number = 50
): string {
  if (avatarUrl) {
    return getOptimizedImageUrl(avatarUrl, {
      width: size,
      height: size,
      crop: "fill",
    });
  }

  // Generate initials-based avatar using UI Avatar service
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&size=${size}&background=random`;
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(imageUrls: string[]): void {
  if (typeof window === "undefined") return;

  imageUrls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Calculate aspect ratio of an image
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Check if an image is loaded
 */
export function checkImageLoaded(imageUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
}

/**
 * Convert file size bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
