import { ApiService } from "./ApiService";
import { ENDPOINTS } from "../lib/constants/apiEndpoints";
import { LoginDTO, AuthResponse, RegisterDTO } from "../types/AuthType";
import { toast } from "react-toastify";
import { toastMessages } from "@/config/toastConfig";
import { TokenStorage } from "./TokenStorage";

export class AuthService {
  
  static async login(data: LoginDTO): Promise<AuthResponse["data"]> {
    try {
      const response = await ApiService.post<any>(ENDPOINTS.AUTH.LOGIN, data);

      if (!response.data || response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Đăng nhập thất bại");
      }

      const { accessToken, user } = response.data.data;

      if (!user || !accessToken) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ");
      }

      TokenStorage.setAccessToken(accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      throw new Error(errorMessage);
    }
  }

  static logout() {
    TokenStorage.clearAuthData();
    toast.success(toastMessages.LOGOUT_SUCCESS);
  }

  static async register(data: RegisterDTO): Promise<AuthResponse["data"]> {
    try {
      const response = await ApiService.post<any>(ENDPOINTS.AUTH.REGISTER, data);

      if (!response.data || response.data.statusCode !== 201) {
        throw new Error(response.data?.message || "Đăng ký thất bại");
      }

      const { accessToken, user } = response.data.data;

      if (!user || !accessToken) {
        throw new Error("Dữ liệu đăng ký không hợp lệ");
      }

      TokenStorage.setAccessToken(accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(toastMessages.REGISTER_SUCCESS);
      return response.data.data;
    } catch (error: any) {
      toast.error(toastMessages.GENERIC_ERROR);
      console.error("Registration error:", error);
      throw error;
    }
  }

  static async getProfile(): Promise<AuthResponse["data"]["user"]> {
    try {
      const response = await ApiService.get<AuthResponse>(ENDPOINTS.USERS.PROFILE);
  
      if (!response.data || response.data.statusCode !== 200 || !response.data.data) {
        throw new Error(response.data?.message || "Không thể lấy thông tin người dùng");
      }
  
      return response.data.user;
    } catch (error: any) {
      console.error("Get profile error:", error);
      throw error;
    }
  }
  
}

