import SignupComponentPage from "@components/website/auth/SignupComponentPage";
import { Metadata } from "next";

const title = "Sign Up";
const description =
  "Securely sign up your account";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function DisputePage() {

  return (
    <SignupComponentPage></SignupComponentPage>
  );
}
