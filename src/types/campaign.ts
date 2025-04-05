import { User } from "./user";
import { CampaignMedia } from "./media";
import { Comment } from "./comment";
import { Donation } from "./donation";
import { FinancialRecord } from "./financial-record";
import { ApiResponse } from "./api";

export interface Campaign {
  id: number;
  title: string;
  description?: string;
  emoji?: string;
  category?: string;
  tags?: string[];
  targetAmount: number;
  collectedAmount: number;
  donationCount: number;
  status: string;
  slug?: string;
  startDate: Date;
  deadline?: Date;
  location?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  createdBy?: User;
  createdById?: number;
  media?: CampaignMedia[];
  donations?: Donation[];
  comments?: Comment[];
  financialRecords?: FinancialRecord[];
}

export interface CampaignFormData {
  title: string;
  description?: string;
  emoji?: string;
  category?: string;
  tags?: string[];
  targetAmount: number;
  startDate: Date;
  deadline?: Date;
  location?: string;
  media?: {
    mediaType: string;
    url?: string;
    caption?: string;
    orderIndex?: number;
    isPrimary?: boolean;
    base64Image?: string;
  }[];
}

export type CampaignResponse = ApiResponse<Campaign>;
export type CampaignsResponse = ApiResponse<{
  data: Campaign[];
  total: number;
  page: number;
  limit: number;
}>;
