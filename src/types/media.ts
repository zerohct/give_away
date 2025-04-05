export interface CampaignMedia {
  id: number;
  mediaType: string;
  url: string;
  caption?: string;
  orderIndex: number;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
  base64Image?: string;
  campaignId?: number;
}
