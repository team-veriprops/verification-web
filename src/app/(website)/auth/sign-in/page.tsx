import SigninComponentPage from "@components/website/auth/SigninComponentPage";
import { Metadata } from "next";

const title = "Sign In";
const description =
  "Securely sign into your account";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function DisputePage() {

  return (
    <SigninComponentPage></SigninComponentPage>
  );
}
