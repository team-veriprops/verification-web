import { Money } from "types/models";


export interface DashboardStats{
  totalVerifications: number;
  pendingVerifications: number;
  successfulVerifications: number;
  flaggedVerifications: number;
  totalSpentAmount: Money;
}
