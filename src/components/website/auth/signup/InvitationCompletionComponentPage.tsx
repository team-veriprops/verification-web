'use client'

import { useUserQueries } from "@components/admin/user/libs/useUserQueries";
import InvitationCompletionModal from "../modals/InvitationCompletionModal";
import { AsyncStateComponent } from "@components/ui/AsyncStateComponent";

export default function InvitationCompletionComponentPage({inviteId, token}:{inviteId: string, token: string}){
    const {useGetInviteUser} = useUserQueries()
    const { data: inviteData, isLoading, isError } = useGetInviteUser(inviteId)

    return (
        <AsyncStateComponent
                  isLoading={isLoading}
                  isError={isError}
                  data={inviteData}
                  loadingText="Loading invitation details..."
                  errorText="Failed to load your invitation details, please try again later."
                  emptyText="No invitation details found."
                >
                  {(data) => {
                    const invitedUser = data?.data ?? null

                    return (
                        <InvitationCompletionModal userInfo={invitedUser} token={token} />
                    )
                }}
        </AsyncStateComponent>
    )
}