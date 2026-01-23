'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./useAuthStore";
import { CreateUserDto, SuccessResponse } from "@components/admin/user/models";
import { useEffect } from "react";
import { ActiveAuditor, ChangePasswordPayload, EmailValidationRequest, InitSocialLoginResponse, LoginPayload, OtpVerificationRequest, RecoverPasswordMessagePayload, RecoverPasswordPayload, SocialAuthProvider, SocialAuthType } from "../models";
import { useRouter } from "next/navigation";

/**
 * React Query hooks wrapping AuthService
 */
export const useAuthQueries = () => {
  const service = useAuthStore((state) => state.service);
  const { setActiveAuditor, resetActiveAuditor, activeAuditor } = useAuthStore();
  const queryClient = useQueryClient();


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
    
  // const useLogout = () =>
  //   useMutation({
  //     mutationFn: () =>
  //       service.logout(),
  // });
    
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
    
  const useSendEmailValidationMessage = () =>
    useMutation({
      mutationFn: (payload: EmailValidationRequest) =>
        service.sendEmailValidationMessage(payload),
  });
    
  const useValidateEmailVerificationOtp = () =>
    useMutation({
      mutationFn: (payload: OtpVerificationRequest) =>
        service.validateEmailVerificationOtp(payload),
  });
    
  const useRecoverPassword = () =>
    useMutation({
      mutationFn: (payload: RecoverPasswordPayload) =>
        service.recoverPassword(payload),
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
    useSendEmailValidationMessage,
    useValidateEmailVerificationOtp,
    useRecoverPassword
  };
};
