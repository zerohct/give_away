import { ApiService } from "./ApiService";
import { ENDPOINTS } from "@/lib/constants/apiEndpoints";
import { Role } from "../types";
import { toast } from "react-toastify";

export class RoleService {
  static async getAllRoles(): Promise<Role[]> {
    try {
      const response = await ApiService.get<any>(ENDPOINTS.ROLES.LIST);
      return response.data.data;
    } catch (error: any) {
      toast.error("Failed to fetch roles");
      throw error;
    }
  }

  static async getRoleById(id: number): Promise<Role> {
    try {
      const response = await ApiService.get<any>(
        `${ENDPOINTS.ROLES.LIST}/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      toast.error("Failed to fetch role");
      throw error;
    }
  }
}
