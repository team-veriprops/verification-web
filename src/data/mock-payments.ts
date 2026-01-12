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
    ref_id: `INV-2026-00${faker.number.int({ min: 1000, max: 9000 })}`,
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
    date_created: faker.date.past().toISOString(),
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
  ref_id: string,
  status: PaymentStatus
): Promise<QueryPaymentDetailDto> {
  return {
    id: faker.string.uuid(),
    ref_id: ref_id,
    payment_channel: faker.helpers.arrayElement([
      PaymentChannel.FLUTTERWAVE,
      PaymentChannel.PAYSTACK,
    ]),
    gateway_response: getGatewayResponse(status),
    property_title: faker.company.catchPhrase(),
    property_location: faker.location.streetAddress(),
    seller: faker.person.fullName(),
    date_created: faker.date.past().toISOString(),
    date_paid: faker.date.past().toISOString(),
  };
}

export async function generatePaymentStats(): Promise<PaymentStats> {
  return {
    total_spent_amount: Money.from({
      value: faker.number.int({ min: 2000000, max: 50000000 }),
      currency: TransactionCurrency.NGN,
    }),
    last_payment_date: faker.date.past().toISOString(),
    total_pending_payment: Money.from({
      value: faker.number.int({ min: 2000000, max: 50000000 }),
      currency: TransactionCurrency.NGN,
    })
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
