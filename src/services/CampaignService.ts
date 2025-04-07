// src/services/CampaignService.ts
import { ApiService } from "./ApiService";
import { ENDPOINTS } from "../lib/constants/apiEndpoints";
import { toast } from "react-toastify";
import { toastMessages } from "@/config/toastConfig";
import { Campaign, CampaignMedia } from "@/types/index";
import { TokenStorage } from "./TokenStorage";

export interface CreateCampaignDTO {
  title: string;
  description?: string;
  emoji?: string;
  category?: string;
  location?: string;
  tags?: string[] | string;
  targetAmount: number;
  isFeatured?: boolean;
  startDate?: string;
  deadline?: string;
  slug?: string;
}

export interface UpdateCampaignDTO extends Partial<CreateCampaignDTO> {}

export interface SearchResponse {
  total: number;
  page: number;
  size: number;
  data: Campaign[];
}

export interface ResponseData<T> {
  statusCode: number;
  message: string;
  data: T;
}

export class CampaignService {
  // Chuyển đổi dữ liệu từ API sang kiểu Campaign với Date
  private static transformCampaign(campaign: any): Campaign {
    return {
      ...campaign,
      startDate: new Date(campaign.startDate),
      deadline: campaign.deadline ? new Date(campaign.deadline) : null,
      createdAt: new Date(campaign.createdAt),
      updatedAt: new Date(campaign.updatedAt),
    };
  }

  static async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const response = await ApiService.get<ResponseData<any[]>>(
        ENDPOINTS.CAMPAIGNS.LIST
      );
      if (!response.data || response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Failed to fetch campaigns");
      }
      return response.data.data.map(this.transformCampaign);
    } catch (error: any) {
      toast.error(error.message || toastMessages.GENERIC_ERROR);
      console.error("Get campaigns error:", error);
      throw error;
    }
  }

  static async getCampaignById(id: string | number): Promise<Campaign> {
    try {
      const response = await ApiService.get<ResponseData<any>>(
        ENDPOINTS.CAMPAIGNS.DETAILS(id.toString())
      );
      if (!response.data || response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Campaign not found");
      }
      return this.transformCampaign(response.data.data);
    } catch (error: any) {
      toast.error(error.message || toastMessages.GENERIC_ERROR);
      console.error(`Get campaign ${id} error:`, error);
      throw error;
    }
  }

  static async createCampaign(
    campaignData: CreateCampaignDTO,
    imageFile?: File
  ): Promise<Campaign> {
    try {
      const formData = new FormData();

      // Xử lý tags (giữ nguyên)
      let tagsArray: string[] = [];
      if (campaignData.tags) {
        if (typeof campaignData.tags === "string") {
          tagsArray = campaignData.tags
            .split(/[,|]/)
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        } else if (Array.isArray(campaignData.tags)) {
          tagsArray = campaignData.tags.filter(
            (tag) => typeof tag === "string"
          );
        }
      }

      // Thêm các trường vào FormData với xử lý boolean
      const fields: (keyof CreateCampaignDTO)[] = [
        "title",
        "description",
        "emoji",
        "category",
        "location",
        "targetAmount",
        "isFeatured",
        "startDate",
        "deadline",
        "slug",
      ];

      fields.forEach((field) => {
        if (campaignData[field] !== undefined) {
          // Xử lý đặc biệt cho boolean
          const value =
            typeof campaignData[field] === "boolean"
              ? campaignData[field]
                ? "true"
                : "false"
              : String(campaignData[field]);
          formData.append(field, value);
        }
      });

      formData.append("tags", JSON.stringify(tagsArray));

      if (imageFile) {
        formData.append("image", imageFile);
      }
      const token = TokenStorage.getAccessToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Log FormData content for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch(ENDPOINTS.CAMPAIGNS.CREATE, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Server error: ${response.status}`
        );
      }

      const responseData = await response.json();
      return this.transformCampaign(responseData.data);
    } catch (error: any) {
      console.error("Create campaign error:", error);
      throw error;
    }
  }
  static async updateCampaign(
    id: string | number,
    updateData: UpdateCampaignDTO,
    imageFile?: File
  ): Promise<Campaign> {
    try {
      const formData = new FormData();

      // Danh sách các trường cần gửi
      const fields: (keyof UpdateCampaignDTO)[] = [
        "title",
        "description",
        "emoji",
        "category",
        "location",
        "targetAmount",
        "isFeatured",
        "startDate",
        "deadline",
        "slug",
      ];

      // Thêm các trường từ updateData vào formData
      fields.forEach((field) => {
        if (updateData[field] !== undefined) {
          formData.append(field, String(updateData[field]));
        }
      });

      // Xử lý và thêm tags vào formData
      if (updateData.tags !== undefined) {
        // Nếu tags là mảng, chuyển thành chuỗi JSON
        formData.append("tags", JSON.stringify(updateData.tags));
      }

      // Nếu có hình ảnh, thêm vào formData
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const token = TokenStorage.getAccessToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Log FormData để kiểm tra dữ liệu gửi đi
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch(ENDPOINTS.CAMPAIGNS.UPDATE(id.toString()), {
        method: "PUT",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Server error: ${response.status}`
        );
      }

      const responseData = await response.json();
      toast.success(
        toastMessages.UPDATE_SUCCESS || "Campaign updated successfully"
      );
      return this.transformCampaign(responseData.data);
    } catch (error: any) {
      toast.error(error.message || toastMessages.GENERIC_ERROR);
      console.error(`Update campaign ${id} error:`, error);
      throw error;
    }
  }
  static async deleteCampaign(id: string | number): Promise<void> {
    try {
      const response = await ApiService.delete<ResponseData<null>>(
        ENDPOINTS.CAMPAIGNS.DELETE(id.toString())
      );
      if (!response.data || response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Failed to delete campaign");
      }
      toast.success(
        toastMessages.DELETE_SUCCESS || "Campaign deleted successfully"
      );
    } catch (error: any) {
      toast.error(error.message || toastMessages.GENERIC_ERROR);
      console.error(`Delete campaign ${id} error:`, error);
      throw error;
    }
  }

  static async searchCampaigns(
    query: string,
    page: number = 1,
    size: number = 10
  ): Promise<SearchResponse> {
    try {
      const searchUrl = `${
        ENDPOINTS.CAMPAIGNS.LIST
      }/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`;
      const response = await ApiService.get<ResponseData<SearchResponse>>(
        searchUrl
      );

      if (!response.data || response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Search failed");
      }

      return {
        total: response.data.data.total,
        page: response.data.data.page,
        size: response.data.data.size,
        data: response.data.data.data.map(this.transformCampaign),
      };
    } catch (error: any) {
      toast.error(error.message || toastMessages.GENERIC_ERROR);
      console.error("Search campaigns error:", error);
      throw error;
    }
  }

  static async addCampaignMedia(
    campaignId: string | number,
    imageFile: File
  ): Promise<CampaignMedia> {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const token = TokenStorage.getAccessToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${ENDPOINTS.CAMPAIGNS.DETAILS(campaignId.toString())}/media`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Server error: ${response.status}`
        );
      }

      const responseData = await response.json();
      toast.success("Media uploaded successfully");
      return responseData.data;
    } catch (error: any) {
      toast.error(error.message || toastMessages.GENERIC_ERROR);
      console.error(`Upload media for campaign ${campaignId} error:`, error);
      throw error;
    }
  }

  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
}
