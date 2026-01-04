import ConversationsComponentPage from "@components/portal/conversations/ConversationsComponentPage";
import { Metadata } from "next";

const title = "Messages & Discussions";
const description = "Messages and discussions concerning your properties.";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function MessagesPage() {
  return <ConversationsComponentPage title={title} description={description} />;
}
