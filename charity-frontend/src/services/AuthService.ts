import { ApiService } from "./apiService";
import { ENDPOINTS } from "../constants/apiEndpoints";
import { LoginDTO, RegisterDTO, AuthResponse } from "../types/auth.types";
import { toast } from "react-toastify";
import { toastMessages } from "@/config/toastConfig";
import { TokenStorage } from "./tokenStorage";

export class AuthService {
  static async login(data: LoginDTO) {
    try {
      const response = await ApiService.post<AuthResponse>(
        ENDPOINTS.AUTH.LOGIN,
        data
      );

      if (response.success && response.data) {
        TokenStorage.setAccessToken(response.data.accessToken);
        toast.success(toastMessages.LOGIN_SUCCESS);
        return response.data;
      }

      throw new Error(response.error || toastMessages.LOGIN_ERROR);
    } catch (error) {
      toast.error(toastMessages.LOGIN_ERROR);
      throw error;
    }
  }

  static logout() {
    TokenStorage.clearAuthData();
    toast.success(toastMessages.LOGOUT_SUCCESS);
  }

  static async register(data: RegisterDTO) {
    try {
      const response = await ApiService.post<AuthResponse>(
        ENDPOINTS.AUTH.REGISTER,
        data
      );

      if (response.success && response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        toast.success(toastMessages.REGISTER_SUCCESS);
        return response.data;
      }

      throw new Error(response.error || "Registration failed");
    } catch (error) {
      toast.error(toastMessages.GENERIC_ERROR);
      throw error;
    }
  }

  static async getProfile() {
    try {
      const response = await ApiService.get<AuthResponse["user"]>(
        ENDPOINTS.USERS.PROFILE
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to get profile");
    } catch (error) {
      throw error;
    }
  }
}
