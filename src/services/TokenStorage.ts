import { sessionStore } from "../lib/utils/storage";
import { STORAGE_KEYS } from "../lib/constants/TokenStorage";

export class TokenStorage {
  // Set access token in sessionStorage
  static setAccessToken(token: string): void {
    sessionStore.set(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  // Get access token from sessionStorage
  static getAccessToken(): string | null {
    return sessionStore.get(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // Set user data in sessionStorage
  static setUserData(userData: any): void {
    sessionStore.set(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }

  // Get user data from sessionStorage
  static getUserData(): any | null {
    const userData = sessionStore.get(STORAGE_KEYS.USER_DATA);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  // Remove access token
  static removeAccessToken(): void {
    sessionStore.remove(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // Clear all auth data
  static clearAuthData(): void {
    sessionStore.remove(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStore.remove(STORAGE_KEYS.USER_DATA);
  }
}
