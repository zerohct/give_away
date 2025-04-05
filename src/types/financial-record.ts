export interface FinancialRecord {
  id: number;
  amount: number;
  type: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  campaignId: number;
}
