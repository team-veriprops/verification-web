import { DashboardStats } from "@components/portal/dashboard/models";
import { faker } from "@faker-js/faker";
import { Money, TransactionCurrency } from "types/models";


export async function generateDashboardStats(): Promise<DashboardStats> {
  return {
    total_verifications: 20,
    pending_verifications: 3,
    successful_verifications: 15,
    flagged_verifications: 2,
    total_spent_amount:  Money.from({
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
