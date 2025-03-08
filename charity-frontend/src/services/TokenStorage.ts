import { sessionStore } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/storage.constants";

export class TokenStorage {
  static getAccessToken(): string | null {
    return sessionStore.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  static setAccessToken(token: string): void {
    sessionStore.set(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  static removeAccessToken(): void {
    sessionStore.remove(STORAGE_KEYS.ACCESS_TOKEN);
  }

  static clearAuthData(): void {
    sessionStore.remove(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStore.remove(STORAGE_KEYS.USER_DATA);
  }
}
