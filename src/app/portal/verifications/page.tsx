import VerificationsComponentPage from "@components/portal/verifications/VerificationsComponentPage";
import { Metadata } from "next";

const title = "My Verifications";
const description =
  "View and manage your property verification requests";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function VerificationPage() {

  return (
    <VerificationsComponentPage title={title} description={description}></VerificationsComponentPage>
  );
}
