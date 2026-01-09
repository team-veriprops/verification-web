import PaymentsComponentPage from "@components/portal/payments/PaymentsComponentPage";
import { Metadata } from "next";

const title = "Payments";
const description =
  "View your payment history and invoices";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function PaymentPage() {

  return (
    <PaymentsComponentPage title={title} description={description}  />
  );
}
