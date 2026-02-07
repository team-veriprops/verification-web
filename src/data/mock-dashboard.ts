import { DashboardStats } from "@components/portal/dashboard/models";
import { faker } from "@faker-js/faker";
import { Money, TransactionCurrency } from "types/models";


export async function generateDashboardStats(): Promise<DashboardStats> {
  return {
    totalVerifications: 20,
    pendingVerifications: 3,
    successfulVerifications: 15,
    flaggedVerifications: 2,
    totalSpentAmount:  Money.from({
      value: faker.number.int({ min: 2000000, max: 50000000 }),
      currency: TransactionCurrency.NGN,
    }),
  };
}

export let dashboardStats: DashboardStats | null = null

async function initData() {
  if (!dashboardStats) {
    dashboardStats = await generateDashboardStats()
  }
}

// Kick off immediately
initData();
