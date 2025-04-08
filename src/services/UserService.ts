import { ApiService } from "./ApiService";
import { ENDPOINTS } from "@/lib/constants/apiEndpoints";
import { User, CreateUserData, UpdateUserData } from "../types/index";
import { toast } from "react-toastify";
import { toastMessages } from "@/config/toastConfig";

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await ApiService.get<any>(ENDPOINTS.USERS.ADMIN_USERS);
      return response.data.data.map(this.transformUserData);
    } catch (error) {
      toast.error(toastMessages.USERS_FETCH_ERROR);
      throw error;
    }
  }

  static async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    try {
      const response = await ApiService.put<any>(
        `${ENDPOINTS.USERS.ADMIN_USERS}/${userId}`,
        data
      );
      toast.success(toastMessages.USER_UPDATE_SUCCESS);
      return this.transformUserData(response.data.data);
    } catch (error) {
      toast.error(toastMessages.USER_UPDATE_ERROR);
      throw error;
    }
  }

  static async updateUserRoles(userId: number, roles: string[]): Promise<User> {
    try {
      const response = await ApiService.put<any>(
        `${ENDPOINTS.USERS.ADMIN_USERS}/${userId}/roles`,
        { roles }
      );
      toast.success(toastMessages.USER_ROLES_UPDATE_SUCCESS);
      return this.transformUserData(response.data.data);
    } catch (error) {
      toast.error(toastMessages.USER_ROLES_UPDATE_ERROR);
      throw error;
    }
  }

  static async deleteUser(userId: number): Promise<void> {
    try {
      await ApiService.delete<any>(`${ENDPOINTS.USERS.ADMIN_USERS}/${userId}`);
      toast.success(toastMessages.USER_DELETE_SUCCESS);
    } catch (error) {
      toast.error(toastMessages.USER_DELETE_ERROR);
      throw error;
    }
  }

  static async getUserById(userId: number): Promise<User> {
    try {
      const response = await ApiService.get<any>(
        `${ENDPOINTS.USERS.ADMIN_USERS}/${userId}`
      );
      return this.transformUserData(response.data.data);
    } catch (error) {
      toast.error(toastMessages.USER_FETCH_ERROR);
      throw error;
    }
  }

  static async createUser(data: CreateUserData): Promise<User> {
    try {
      const payload = {
        email: data.user.email,
        password: data.user.password,
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        phone: data.user.phone || null,
        roles: data.roles || "user",
      };
      console.log("Payload sent to server:", JSON.stringify(payload, null, 2));
      const response = await ApiService.post<any>(
        ENDPOINTS.USERS.ADMIN_USERS,
        payload
      );
      toast.success(toastMessages.USER_CREATE_SUCCESS);
      return this.transformUserData(response.data.data);
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        throw new Error(error.response.data.message);
      }
      toast.error(toastMessages.USER_CREATE_ERROR);
      throw error;
    }
  }
  private static transformUserData(userData: any): User {
    // Nếu userData là null hoặc không có id, không throw lỗi ngay mà để caller xử lý
    if (!userData || typeof userData.id !== "number") {
      throw new Error("Invalid user data received from server");
    }
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      username: userData.username || null,
      phone: userData.phone || "",
      profileImage: userData.profileImage || null,
      role: userData.roles?.[0]?.name || "user",
    };
  }
}
