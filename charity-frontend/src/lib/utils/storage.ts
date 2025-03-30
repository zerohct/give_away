/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Wrapper for localStorage to handle errors
 */
export const storage = {
  /**
   * Get item from localStorage
   */
  get<T = any>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
      return false;
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage", error);
      return false;
    }
  },
};

/**
 * Cookie utilities
 */
export const cookies = {
  /**
   * Get cookie by name
   */
  get(name: string): string | null {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  },

  /**
   * Set cookie
   */
  set(
    name: string,
    value: string,
    days: number = 7,
    options: { path?: string; secure?: boolean; sameSite?: string } = {}
  ): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const path = options.path || "/";
    const secure = options.secure ? "; secure" : "";
    const sameSite = options.sameSite
      ? `; sameSite=${options.sameSite}`
      : "; sameSite=Lax";

    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=${path}${secure}${sameSite}`;
  },

  /**
   * Remove cookie
   */
  remove(name: string, path: string = "/"): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
  },
};

/**
 * Session storage wrapper
 */
export const sessionStore = {
  get<T = any>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error getting item from sessionStorage: ${key}`, error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item in sessionStorage: ${key}`, error);
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item from sessionStorage: ${key}`, error);
      return false;
    }
  },

  clear(): boolean {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing sessionStorage", error);
      return false;
    }
  },
};
