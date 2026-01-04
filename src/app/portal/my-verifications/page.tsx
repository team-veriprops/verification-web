import { MyForSaleComponentPage } from "@components/portal/my-verifications/MyForSaleComponentPage";
import { Metadata } from "next";

const title = "My For Sale";
const description =
  "Manage all your properties and services currently listed for sale. Track their status, update details, and monitor interest from buyers.";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function MyForSalePage() {
  return <MyForSaleComponentPage title={title} description={description} />;
}
