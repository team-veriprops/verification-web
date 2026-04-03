import RoleComponentPage from "@components/admin/user/role/RoleComponentPage";
import { Metadata } from "next";

const title = "Roles";
const description =
  "Manage Roles";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function PaymentPage() {

  return (
    <RoleComponentPage title={title} description={description}  />
  );
}
