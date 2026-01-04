import { Metadata } from "next";

const title = "My Purchases";
const description =
  "Manage all the lands, houses, and services you’ve purchased on Veriprops. Track purchase status, download receipts, and access support for each property or service.";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function SupportPage() {

  return (
    <>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Support</h2>
        <p>Welcome to the portal dashboard. Replace with real widgets.</p>
      </section>
    </>
  );
}
