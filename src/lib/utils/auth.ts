import { storage } from "./storage";
// import { User } from "../types/models";

// Constants
const TOKEN_KEY = "charity_auth_token";
const USER_KEY = "charity_user";
const TOKEN_EXPIRY_KEY = "charity_token_expiry";

/**
 * Authentication utilities
 */
const auth = {
  /**
   * Set authentication data after successful login
   */
  //   setAuth(token: string, user: User, expiresInSeconds = 86400): void {
  //     const expiryTime = new Date().getTime() + expiresInSeconds * 1000;

  //     storage.set(TOKEN_KEY, token);
  //     storage.set(USER_KEY, user);
  //     storage.set(TOKEN_EXPIRY_KEY, expiryTime);
  //   },

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return storage.get<string>(TOKEN_KEY);
  },

  /**
   * Get current authenticated user
   */
  //   getUser(): User | null {
  //     return storage.get<User>(USER_KEY);
  //   },

  /**
   * Check if user is authenticated and token is valid
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiryTime = storage.get<number>(TOKEN_EXPIRY_KEY);

    if (!token || !expiryTime) {
      return false;
    }

    // Check if token is expired
    return new Date().getTime() < expiryTime;
  },

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  isTokenExpiringSoon(): boolean {
    const expiryTime = storage.get<number>(TOKEN_EXPIRY_KEY);

    if (!expiryTime) {
      return false;
    }

    // Check if token expires within 5 minutes
    const fiveMinutes = 5 * 60 * 1000;
    return new Date().getTime() > expiryTime - fiveMinutes;
  },

  /**
   * Log out user by clearing auth data
   */
  logout(): void {
    storage.remove(TOKEN_KEY);
    storage.remove(USER_KEY);
    storage.remove(TOKEN_EXPIRY_KEY);
  },

  /**
   * Check if user has specific role
   */
  //   hasRole(role: string | string[]): boolean {
  //     const user = this.getUser();

  //     if (!user) {
  //       return false;
  //     }

  //     if (Array.isArray(role)) {
  //       return role.includes(user.role);
  //     }

  //     return user.role === role;
  //   },

  /**
   * Format user display name
   */
  //   getUserDisplayName(): string {
  //     const user = this.getUser();

  //     if (!user) {
  //       return "Guest";
  //     }

  //     return `${user.firstName} ${user.lastName}`;
  //   },

  /**
   * Get user initials (for avatar fallback)
   */
  //   getUserInitials(): string {
  //     const user = this.getUser();

  //     if (!user) {
  //       return "G";
  //     }

  //     return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  //   },
};

export default auth;
