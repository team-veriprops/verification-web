'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "./useUserStore";
import { CreateInvitedUserDto, CreateUserDto, QueryInvitedUserDto, QueryUserDto, SearchInvitedUserDto } from "@components/admin/user/models";
import { useEffect } from "react";
import { ActiveAuditor, ChangePasswordPayload, VerificationRequestDto, InitSocialLoginResponse, LoginPayload, RecoverPasswordMessagePayload, RecoverPasswordPayload, SocialAuthProvider, SocialAuthType } from "../../../website/auth/models";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";
import { Page, SuccessResponse } from "types/models";
import { SearchUserDto } from "@components/admin/user/models";

/**
 * React Query hooks wrapping AuthService
 */
export const useUserQueries = () => {
  const service = useUserStore((state) => state.service);
  const { setActiveAuditor, resetActiveAuditor, activeAuditor } = useUserStore();
  const queryClient = useQueryClient();
  const filters = useUserStore(useShallow((state) => state.filters));
  const normalizedFilters = stringifyFilters(filters);
  const invitedUserFilters = useUserStore(useShallow((state) => state.invitedUserFilters));
  const normalizedInvitedUserFilters = stringifyFilters(invitedUserFilters);


  const useInitSocialAuth = () =>
    useMutation<
    InitSocialLoginResponse,
    Error,
    { provider: SocialAuthProvider; authType: SocialAuthType }
  >({
      mutationFn: ({ provider, authType }) =>
        service.initSocialAuth(provider, authType),
  });

  const useCreateUser = () =>
    useMutation({
      mutationFn: (payload: CreateUserDto) =>
        service.createUser(payload),
  });
    
  const useLogin = () =>
    useMutation({
      mutationFn: (payload: LoginPayload) =>
        service.login(payload),
  });

  const useGetAuth = () => {
    const result = useQuery<SuccessResponse<ActiveAuditor>>({
      queryKey: ["get-active-auditor-details"] as const,
      queryFn: async (): Promise<SuccessResponse<ActiveAuditor>> => service.getProfile(),
      placeholderData: (prev) => prev,
      enabled: !activeAuditor?.id
    });

    useEffect(() => {
      if (result.data) {
        setActiveAuditor(result.data?.data ?? null);
      }
    }, [result.status, result.data]);

    return result;
  };

  const useRefreshToken = () =>
    useMutation({
      mutationFn: () =>
        service.refreshToken(),
  });

  const clearUserSession = () => {
    // Clear cached user/session data
    queryClient.clear();

    // Clear ActiveAuditor
    resetActiveAuditor()
  }

  const useLogout = () => {
    const router = useRouter();

    return useMutation({
      mutationKey: ["logout"],
      mutationFn: () => service.logout(),

      onSuccess: () => {
        clearUserSession()
        router.replace("/auth/sign-in");
      },

      onError: (error) => {
        console.error("Logout failed", error);
        clearUserSession()
        router.replace("/auth/sign-in");
      },
    });
  };
    
  const useChangePassword = () =>
    useMutation({
      mutationFn: (payload: ChangePasswordPayload) =>
        service.changePassword(payload),
  });
    
  const useSendRecoverPasswordMessage = () =>
    useMutation({
      mutationFn: (payload: RecoverPasswordMessagePayload) =>
        service.sendRecoverPasswordMessage(payload),
  });
    
  const useSendEmailVerificationMessage = () =>
    useMutation({
      mutationFn: (payload: VerificationRequestDto) =>
        service.sendEmailVerificationMessage(payload),
  });
    
  const useValidateEmailVerificationOtp = () =>
    useMutation({
      mutationFn: (payload: VerificationRequestDto) =>
        service.validateEmailVerificationOtp(payload),
  });
    
  const useSendPhoneVerificationMessage = () =>
    useMutation({
      mutationFn: (payload: VerificationRequestDto) =>
        service.sendPhoneVerificationMessage(payload),
  });
    
  const useValidatePhoneVerificationOtp = () =>
    useMutation({
      mutationFn: (payload: VerificationRequestDto) =>
        service.validatePhoneVerificationOtp(payload),
  });
    
  const useRecoverPassword = () =>
    useMutation({
      mutationFn: (payload: RecoverPasswordPayload) =>
        service.recoverPassword(payload),
  });
  
  const useSearchUserPage = () =>
    useQuery<Page<QueryUserDto>>({
      queryKey: ["users", normalizedFilters],
      queryFn: async (): Promise<Page<QueryUserDto>> =>
        service.searchUserPage(filters as SearchUserDto),
      placeholderData: (prev) => prev,
      // enabled: !!company_id, // only fetch if company_id exists
    });
  

  const useDeleteUser = () =>
    useMutation({
      mutationFn: (userId: string) =>
        service.deleteUser(userId),
  });

  // Invites
  const useInviteNormalUser = () =>
    useMutation({
      mutationFn: (payload: CreateInvitedUserDto) =>
        service.inviteNormalUser(payload),
  });

  const useInviteAdminUser = () =>
    useMutation({
      mutationFn: (payload: CreateInvitedUserDto) =>
        service.inviteAdminUser(payload),
  });

  const useReInviteUser = () =>
    useMutation({
      mutationFn: (inviteId: string) =>
        service.reInviteUser(inviteId),
  });

  const useGetInviteUser = (inviteId: string) => 
    useQuery<SuccessResponse<QueryInvitedUserDto>>({
      queryKey: ["get-invited_user", inviteId] as const,
      queryFn: async (): Promise<SuccessResponse<QueryInvitedUserDto>> => service.getInviteUser(inviteId),
      placeholderData: (prev) => prev,
      enabled: !!inviteId
    });

  const useSearchInvitedUserPage = () =>
    useQuery<Page<QueryInvitedUserDto>>({
      queryKey: ["invited_users", normalizedInvitedUserFilters],
      queryFn: async (): Promise<Page<QueryInvitedUserDto>> =>
        service.searchInvitedUserPage(invitedUserFilters as SearchInvitedUserDto),
      placeholderData: (prev) => prev,
      // enabled: !!company_id, // only fetch if company_id exists
    });


  const useDeleteInvitedUser = () =>
    useMutation({
      mutationFn: (inviteId: string) =>
        service.deleteInviteUser(inviteId),
  });

  return {
    useInitSocialAuth,
    useCreateUser,
    useLogin,
    useGetAuth,
    useRefreshToken,
    useLogout,
    useChangePassword,
    useSendRecoverPasswordMessage,
    useSendEmailVerificationMessage,
    useValidateEmailVerificationOtp,
    useSendPhoneVerificationMessage,
    useValidatePhoneVerificationOtp,
    useRecoverPassword,
    useSearchUserPage,
    useDeleteUser,

    useInviteNormalUser,
    useInviteAdminUser,
    useReInviteUser,
    useGetInviteUser,
    useSearchInvitedUserPage,
    useDeleteInvitedUser
  };
};
