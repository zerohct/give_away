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

  // Campaigns
  CREATE_SUCCESS: "Campaign created successfully",
  DELETE_SUCCESS: "Campaign deleted successfully",
  UPDATE_SUCCESS: "Campaign updated successfully",

  USERS_FETCH_SUCCESS: "Users retrieved successfully",
  USERS_FETCH_ERROR: "Failed to fetch users list",
  USER_CREATE_SUCCESS: "User created successfully",
  USER_CREATE_ERROR: "Failed to create new user",
  USER_UPDATE_SUCCESS: "User updated successfully",
  USER_UPDATE_ERROR: "Failed to update user information",
  USER_DELETE_SUCCESS: "User deleted successfully",
  USER_DELETE_ERROR: "Failed to delete user",
  USER_ROLES_UPDATE_SUCCESS: "User roles updated successfully",
  USER_ROLES_UPDATE_ERROR: "Failed to update user roles",
  USER_FETCH_ERROR: "Failed to get user details",
  USER_DEACTIVATE_SUCCESS: "User deactivated successfully",
  USER_ACTIVATE_SUCCESS: "User activated successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  AVATAR_UPLOAD_SUCCESS: "Profile picture updated successfully",
  AVATAR_UPLOAD_ERROR: "Failed to update profile picture",

  // Permissions
  PERMISSION_DENIED: "You don't have permission for this action",
  ADMIN_RESTRICTION: "This action requires administrator privileges",

  // Verification
  EMAIL_VERIFICATION_SENT: "Verification email sent successfully",
  EMAIL_VERIFICATION_SUCCESS: "Email verified successfully",
  PHONE_VERIFICATION_SUCCESS: "Phone number verified successfully",
};
