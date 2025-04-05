import { User } from "./user";

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: User;
  campaignId: number;
}
