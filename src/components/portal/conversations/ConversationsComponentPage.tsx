import PageHeader from "@components/ui/PageHeader";
import { PageDetails } from "types/models";
import ConversationsComponent from "./ConversationsComponent";
import MessagesComponent from "./messages/MessagesComponent";

export default function ConversationsComponentPage({
  title,
  description,
}: PageDetails) {
  return (
    <div className="space-y-6 min-h-0">
      <PageHeader title={title} description={description} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <ConversationsComponent />
        <MessagesComponent />
      </div>
    </div>
  );
}
