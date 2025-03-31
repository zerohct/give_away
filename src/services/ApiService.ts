// apiService.ts
import { fetchApi } from "../lib/utils/apiHandler";
import { TokenStorage } from "./TokenStorage";

export class ApiService {
  private static getAuthHeader() {
    const token = TokenStorage.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {} as HeadersInit;  // Trả về header Authorization nếu có token
  }

  static async get<T>(url: string) {
    return fetchApi<T>(url, {
      headers: {
        ...this.getAuthHeader(),
      },
    });
  }

  static async post<T>(url: string, data: any) {
    return fetchApi<T>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
  }

  static async put<T>(url: string, data: any) {
    return fetchApi<T>(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(url: string) {
    return fetchApi<T>(url, {
      method: "DELETE",
      headers: {
        ...this.getAuthHeader(),
      },
    });
  }
}
