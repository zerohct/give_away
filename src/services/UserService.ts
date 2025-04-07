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

  static async createUser(data: CreateUserData): Promise<User> {
    try {
      const payload = {
        user: data.user,
        roles: data.roles || ["user"],
      };

      const response = await ApiService.post<any>(
        ENDPOINTS.USERS.ADMIN_USERS,
        payload
      );
      toast.success(toastMessages.USER_CREATE_SUCCESS);
      return this.transformUserData(response.data.data);
    } catch (error) {
      toast.error(toastMessages.USER_CREATE_ERROR);
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

  private static transformUserData(userData: any): User {
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      phone: userData.phone,
      avatar: userData.profileImage,
      role: userData.roles?.[0]?.name || "user",
    };
  }
}
