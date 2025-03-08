// lib/config/toastConfig.ts

import { ToastOptions } from "react-toastify";

export const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const toastTypes = {
  SUCCESS: {
    ...toastConfig,
    autoClose: 3000,
    className: "toast-success",
  },
  ERROR: {
    ...toastConfig,
    autoClose: 6000,
    className: "toast-error",
  },
  WARNING: {
    ...toastConfig,
    autoClose: 4000,
    className: "toast-warning",
  },
  INFO: {
    ...toastConfig,
    autoClose: 3000,
    className: "toast-info",
  },
};

/**
 * Toast message helper function
 */
export const toastMessages = {
  // Authentication
  LOGIN_SUCCESS: "You have successfully logged in",
  LOGIN_ERROR: "Login failed. Please check your credentials",
  REGISTER_SUCCESS: "Account created successfully",
  LOGOUT_SUCCESS: "You have been logged out successfully",
  PASSWORD_RESET_EMAIL: "Password reset instructions sent to your email",

  // Donations
  DONATION_SUCCESS: "Thank you for your generous donation!",
  DONATION_ERROR: "We encountered an issue processing your donation",

  // Volunteer
  VOLUNTEER_REGISTER_SUCCESS: "Thank you for registering as a volunteer!",
  EVENT_REGISTER_SUCCESS: "You have successfully registered for this event",

  // Forms
  FORM_ERROR: "Please fix the errors in the form",
  SUBMISSION_SUCCESS: "Form submitted successfully",

  // Generic
  GENERIC_ERROR: "Something went wrong. Please try again later",
  GENERIC_SUCCESS: "Operation completed successfully",
  SESSION_EXPIRED: "Your session has expired. Please log in again",
  NETWORK_ERROR: "Network error. Please check your connection",
};
