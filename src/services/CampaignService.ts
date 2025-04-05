import { ApiService } from "./ApiService";
import { ENDPOINTS } from "../lib/constants/apiEndpoints";
import { toast } from "react-toastify";
import { toastMessages } from "@/config/toastConfig";

// Define types based on backend structure
export interface Campaign {
  id: number;
  title: string;
  description: string | null;
  emoji: string | null;
  category: string | null;
  location: string | null;
  tags: string[];
  targetAmount: number;
  collectedAmount: number;
  donationCount: number;
  status: string;
  slug: string | null;
  isFeatured: boolean;
  startDate: string;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  media?: CampaignMedia[];
}

export interface CampaignMedia {
  id: number;
  mediaType: string;
  url: string;
  base64Image?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  static async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const response = await ApiService.get<ResponseData<Campaign[]>>(
        ENDPOINTS.CAMPAIGNS.LIST
      );

      if (!response.data || response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Failed to fetch campaigns");
      }

      return response.data.data;
    } catch (error: any) {
      toast.error(error.message || toastMessages.GENERIC_ERROR);
      console.error("Get campaigns error:", error);
      throw error;
    }
  }

  static async getCampaignById(id: string | number): Promise<Campaign> {
    try {
      const response = await ApiService.get<ResponseData<Campaign>>(
        ENDPOINTS.CAMPAIGNS.DETAILS(id.toString())
      );

      if (!response.data || response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Campaign not found");
      }

      return response.data.data;
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
      // Handle file upload with form data
      const formData = new FormData();

      // Add all campaign data to form
      Object.entries(campaignData).forEach(([key, value]) => {
        if (value !== undefined) {
          // Convert arrays to JSON string for tags
          if (key === "tags" && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add image if provided
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Custom fetch for FormData
      const token = localStorage.getItem("accessToken");
      const response = await fetch(ENDPOINTS.CAMPAIGNS.CREATE, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const responseData = await response.json();

      if (!responseData || responseData.statusCode !== 201) {
        throw new Error(responseData?.message || "Failed to create campaign");
      }

      toast.success(
        toastMessages.CREATE_SUCCESS || "Campaign created successfully"
      );
      return responseData.data;
    } catch (error: any) {
      toast.error(error.message || toastMessages.GENERIC_ERROR);
      console.error("Create campaign error:", error);
      throw error;
    }
  }

  static async updateCampaign(
    id: string | number,
    updateData: UpdateCampaignDTO
  ): Promise<Campaign> {
    try {
      const response = await ApiService.put<ResponseData<Campaign>>(
        ENDPOINTS.CAMPAIGNS.UPDATE(id.toString()),
        updateData
      );

      if (!response.data || response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Failed to update campaign");
      }

      toast.success(
        toastMessages.UPDATE_SUCCESS || "Campaign updated successfully"
      );
      return response.data.data;
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
      // Build URL with query parameters
      const searchUrl = `${
        ENDPOINTS.CAMPAIGNS.LIST
      }/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`;

      const response = await ApiService.get<ResponseData<SearchResponse>>(
        searchUrl
      );

      if (!response.data || response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Search failed");
      }

      return response.data.data;
    } catch (error: any) {
      toast.error(error.message || toastMessages.GENERIC_ERROR);
      console.error("Search campaigns error:", error);
      throw error;
    }
  }

  static async addCampaignMedia(
    campaignId: string | number,
    imageBase64: string
  ): Promise<CampaignMedia> {
    try {
      const response = await ApiService.post<ResponseData<CampaignMedia>>(
        `${ENDPOINTS.CAMPAIGNS.DETAILS(campaignId.toString())}/media`,
        { base64Image: imageBase64 }
      );

      if (!response.data || response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Failed to upload media");
      }

      toast.success("Media uploaded successfully");
      return response.data.data;
    } catch (error: any) {
      toast.error(error.message || toastMessages.GENERIC_ERROR);
      console.error(`Upload media for campaign ${campaignId} error:`, error);
      throw error;
    }
  }

  // Helper method to convert File to base64 string
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
}
