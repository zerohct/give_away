import { ApiService } from "./ApiService";
import { ENDPOINTS } from "../lib/constants/apiEndpoints";
import { LoginDTO, AuthResponse, RegisterDTO, User } from "../types/index";
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

      // Check if user has roles array and extract role
      if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
        user.role = user.roles[0].name; // Extract the first role name
      } else {
        user.role = "user"; // Default role if not provided
      }

      TokenStorage.setAccessToken(accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      throw new Error(errorMessage);
    }
  }

  static logout() {
    TokenStorage.clearAuthData();
    toast.success(toastMessages.LOGOUT_SUCCESS);
  }

  static async register(data: RegisterDTO): Promise<AuthResponse["data"]> {
    try {
      const response = await ApiService.post<any>(
        ENDPOINTS.AUTH.REGISTER,
        data
      );

      if (!response.data || response.data.statusCode !== 201) {
        throw new Error(response.data?.message || "Đăng ký thất bại");
      }

      const { accessToken, user } = response.data.data;

      if (!user || !accessToken) {
        throw new Error("Dữ liệu đăng ký không hợp lệ");
      }

      // Set default role for registered users
      if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
        user.role = user.roles[0].name;
      } else {
        user.role = "user";
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

  static async getProfile(): Promise<User> {
    try {
      const response = await ApiService.get<any>(ENDPOINTS.USERS.PROFILE);

      if (
        !response.data ||
        response.data.statusCode !== 200 ||
        !response.data.data
      ) {
        throw new Error(
          response.data?.message || "Không thể lấy thông tin người dùng"
        );
      }

      const userData = response.data.data;

      // Transform API response to match User interface
      const user: User = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        phone: userData.phone || undefined,
        role:
          userData.roles &&
          Array.isArray(userData.roles) &&
          userData.roles.length > 0
            ? userData.roles[0].name
            : "user",
        avatar: userData.profileImage || undefined,
        status: userData.isActive ? "active" : "inactive",
      };

      return user;
    } catch (error: any) {
      console.error("Get profile error:", error);
      throw error;
    }
  }
}
