import { Money } from "types/models";


export interface DashboardStats{
  total_verifications: number;
  pending_verifications: number;
  successful_verifications: number;
  flagged_verifications: number;
  total_spent_amount: Money;
}
