/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchApi } from "../utils/apiHandler";
import { TokenStorage } from "./tokenStorage";

export class ApiService {
  private static getAuthHeader() {
    const token = TokenStorage.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
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
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
  }

  static async put<T>(url: string, data: any) {
    return fetchApi<T>(url, {
      method: "PUT",
      headers: {
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
