import InvitationCompletionComponentPage from "@components/website/auth/signup/InvitationCompletionComponentPage";
import { Metadata } from "next";

const title = "Invitation Completion";
const description =
  "Complete user registration as an invited user";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default async function InviteCompletionPage({
  params,
  searchParams,
}: {
  params: Promise<{ invite_id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { invite_id } = await params;
  const { token } = await searchParams;

  return (
    <InvitationCompletionComponentPage inviteId={invite_id} token={token ?? ""}></InvitationCompletionComponentPage>
  );
}
