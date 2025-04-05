import { User } from "./user";

export interface Donation {
  id: number;
  amount: number;
  message?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: User;
  campaignId: number;
}
