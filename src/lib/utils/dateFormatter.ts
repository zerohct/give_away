// src/lib/dateFormatter.ts
/**
 * Format date to display in standard locale format
 */
export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  // Kiểm tra nếu date là không hợp lệ
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid date"; // Trả về thông báo nếu không phải kiểu ngày hợp lệ
  }

  return new Intl.DateTimeFormat("default", options).format(date);
}

/**
 * Format date to display in short format (e.g., "Jan 1, 2025")
 */
export function formatShortDate(dateString: string | Date): string {
  return formatDate(dateString, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date and time (e.g., "Jan 1, 2025, 3:30 PM")
 */
export function formatDateTime(dateString: string | Date): string {
  return formatDate(dateString, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 */
export function getRelativeTime(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return formatDateTime(date);
  }

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return "Just now";
}

/**
 * Check if a date is in the past
 */
export function isPastDate(dateString: string | Date): boolean {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date < new Date();
}

/**
 * Format time remaining for countdown (e.g., campaigns, events)
 */
export function formatTimeRemaining(endDateString: string | Date): string {
  const endDate =
    typeof endDateString === "string" ? new Date(endDateString) : endDateString;
  const now = new Date();

  if (endDate <= now) {
    return "Ended";
  }

  const totalSeconds = Math.floor((endDate.getTime() - now.getTime()) / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} remaining`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} remaining`;
  } else {
    return `${minutes} minute${minutes > 1 ? "s" : ""} remaining`;
  }
}
