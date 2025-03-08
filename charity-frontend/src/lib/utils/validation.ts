/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Phone number validation (international format)
 */
export function isValidPhone(phone: string): boolean {
  // Basic international phone validation
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ""));
}

/**
 * URL validation
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Password strength validation
 * - At least 6 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains a number
 */
export function isStrongPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if value is empty (null, undefined, empty string, or empty array)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Validate donation amount (positive number within range)
 */
export function isValidDonationAmount(amount: number): {
  isValid: boolean;
  error?: string;
} {
  const minAmount = 1;
  const maxAmount = 1000000;

  if (isNaN(amount)) {
    return { isValid: false, error: "Please enter a valid number" };
  }

  if (amount < minAmount) {
    return { isValid: false, error: `Minimum donation amount is ${minAmount}` };
  }

  if (amount > maxAmount) {
    return { isValid: false, error: `Maximum donation amount is ${maxAmount}` };
  }

  return { isValid: true };
}
