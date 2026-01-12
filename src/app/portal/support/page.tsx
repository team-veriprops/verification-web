import SupportComponentPage from "@components/portal/support/SupportComponentPage";
import { Metadata } from "next";

const title = "Support & Help";
const description =
  "Find answers or contact our support team.";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function SupportPage() {

  return (
    <SupportComponentPage
      title={title}
      description={description}
    />
  );
}
