import { ApiService } from "./ApiService";
import { ENDPOINTS } from "../lib/constants/apiEndpoints";
import { LoginDTO, AuthResponse, RegisterDTO } from "../types/AuthType";
import { toast } from "react-toastify";
import { toastMessages } from "@/config/toastConfig";
import { TokenStorage } from "./TokenStorage";

export class AuthService {
  // Đăng nhập
 // AuthService.ts
static async login(data: LoginDTO) {
  try {
    const response = await ApiService.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);

    if (response.success && response.data) {
      // Lưu token và thông tin người dùng vào localStorage
      TokenStorage.setAccessToken(response.data.accessToken);  // Lưu token
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Lưu thông tin người dùng vào localStorage
      toast.success(toastMessages.LOGIN_SUCCESS);
      return response.data;
    }

    throw new Error(response.error || toastMessages.LOGIN_ERROR);
  } catch (error) {
    toast.error(toastMessages.LOGIN_ERROR);
    console.error('Login error:', error);
    throw error;
  }
}

  // Đăng xuất
  static logout() {
    // Xóa token và thông tin người dùng khỏi sessionStorage
    TokenStorage.clearAuthData();
    toast.success(toastMessages.LOGOUT_SUCCESS);
  }

  static async register(data: RegisterDTO) {
    try {
      const response = await ApiService.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);

      // Kiểm tra phản hồi thành công và có dữ liệu, lưu token vào sessionStorage
      if (response.success && response.data) {
        TokenStorage.setAccessToken(response.data.accessToken);  // Lưu token
        toast.success(toastMessages.REGISTER_SUCCESS);
        return response.data;
      }

      throw new Error(response.error || "Registration failed");
    } catch (error) {
      toast.error(toastMessages.GENERIC_ERROR);
      console.error("Registration error:", error);
      throw error;
    }
  }
  // Lấy thông tin người dùng (Profile)
  static async getProfile() {
    try {
      const response = await ApiService.get<AuthResponse["user"]>(
        ENDPOINTS.USERS.PROFILE
      );

      // Nếu có dữ liệu người dùng, trả về dữ liệu
      if (response.success && response.data) {
        return response.data;
      }

      // Nếu có lỗi, ném lỗi cho phép thông báo
      throw new Error(response.error || "Failed to get profile");
    } catch (error) {
      // Xử lý lỗi khi không thể lấy profile
      console.error("Get profile error:", error);
      throw error; // Ném lỗi để có thể xử lý ở nơi gọi
    }
  }
}