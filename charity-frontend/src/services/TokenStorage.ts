// tokenStorage.ts
import { sessionStore } from "../lib/utils/storage";
import { STORAGE_KEYS } from "../lib/constants/TokenStorage";

// TokenStorage.ts
export class TokenStorage {
  // Lưu token vào sessionStorage
  static setAccessToken(token: string): void {
    sessionStorage.setItem('accessToken', token);
  }

  // Lấy token từ sessionStorage
  static getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  // Xóa token khỏi sessionStorage
  static clearAccessToken(): void {
    sessionStorage.removeItem('accessToken');
  }
  static removeAccessToken(): void {
    sessionStore.remove(STORAGE_KEYS.ACCESS_TOKEN);
  }

  static clearAuthData(): void {
    sessionStore.remove(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStore.remove(STORAGE_KEYS.USER_DATA);
  }
}
