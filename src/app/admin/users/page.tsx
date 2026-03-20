import UserComponentPage from "@components/admin/user/UserComponentPage";
import { Metadata } from "next";

const title = "Users";
const description =
  "Manage Users";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function PaymentPage() {

  return (
    <UserComponentPage title={title} description={description}  />
  );
}
