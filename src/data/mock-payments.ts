import {
  PaymentChannel,
  QueryPaymentDetailDto,
} from "@components/portal/payments/details/models";
import {
  QueryPaymentDto,
  PaymentStats,
  PaymentStatus,
} from "@components/portal/payments/models";
import { faker } from "@faker-js/faker";
import { Money, TransactionCurrency } from "types/models";

  
export async function generatePayment(): Promise<QueryPaymentDto> {
  return {
    id: faker.string.uuid(),
    refId: `INV-2026-00${faker.number.int({ min: 1000, max: 9000 })}`,
    description: faker.helpers.arrayElement([
      `Basic Verification - VRP-2026-00${faker.number.int({ min: 1000, max: 9000 })}`,
      `Standard Verification - VRP-2026-00${faker.number.int({ min: 1000, max: 9000 })}`,
      `Premium Verification - VRP-2026-00${faker.number.int({ min: 1000, max: 9000 })}`,
    ]),
    amount: Money.from({
      value: faker.number.int({ min: 20000, max: 500000 }),
      currency: TransactionCurrency.NGN,
    }),
    status: faker.helpers.arrayElement([
      PaymentStatus.PENDING,
      PaymentStatus.COMPLETED,
      PaymentStatus.CANCELLED,
      PaymentStatus.FAILED,
    ]),
    dateCreated: faker.date.past().toISOString(),
  };
}


  const getGatewayResponse = (status: PaymentStatus) => {
    switch(status){
      case PaymentStatus.PENDING: return "Processing"
      case PaymentStatus.COMPLETED: return "Approved"
      case PaymentStatus.CANCELLED: return "Cancelled"
      case PaymentStatus.FAILED: return "Declined"
    }
  }

export async function generatePaymentDetail(
  refId: string,
  status: PaymentStatus
): Promise<QueryPaymentDetailDto> {
  return {
    id: faker.string.uuid(),
    refId: refId,
    paymentChannel: faker.helpers.arrayElement([
      PaymentChannel.FLUTTERWAVE,
      PaymentChannel.PAYSTACK,
    ]),
    gatewayResponse: getGatewayResponse(status),
    propertyTitle: faker.company.catchPhrase(),
    propertyLocation: faker.location.streetAddress(),
    seller: faker.person.fullName(),
    dateCreated: faker.date.past().toISOString(),
    datePaid: faker.date.past().toISOString(),
  };
}

export async function generatePaymentStats(): Promise<PaymentStats> {
  return {
    totalSpentAmount: Money.from({
      value: faker.number.int({ min: 2000000, max: 50000000 }),
      currency: TransactionCurrency.NGN,
    }),
    lastPaymentDate: faker.date.past().toISOString(),
    totalPendingAmount: Money.from({
      value: faker.number.int({ min: 2000000, max: 50000000 }),
      currency: TransactionCurrency.NGN,
    }),
    totalPending: 3,
    totalPayment: 23
  };
}

export let payments: QueryPaymentDto[] = [];
export const paymentDetails: QueryPaymentDetailDto[] = [];
export let paymentStats: PaymentStats | null = null

async function initData() {
  // only generate once
  if (payments.length === 0) {
    payments = await Promise.all(
      Array.from({ length: 20 }, () => generatePayment())
    );
  }

  if (paymentDetails.length === 0) {
    for (const payment of payments) {
      const this_details = await generatePaymentDetail(payment.id!, payment.status);

      paymentDetails.push(this_details);
    }
  }

  if (paymentDetails.length > 0) {
    paymentStats = await generatePaymentStats()
  }
}

// Kick off immediately
initData();
