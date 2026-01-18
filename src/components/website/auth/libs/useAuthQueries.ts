'use client'

import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "./useAuthStore";
import { CreateUserDto, LoginSuccessDto } from "@components/admin/user/models";
import { useEffect } from "react";
import { ChangePasswordPayload, EmailValidationRequest, InitSocialLoginResponse, LoginPayload, OtpVerificationRequest, RecoverPasswordMessagePayload, RecoverPasswordPayload, SocialAuthProvider, SocialAuthType } from "../models";

/**
 * React Query hooks wrapping AuthService
 */
export const useAuthQueries = () => {
  const service = useAuthStore((state) => state.service);
  const { setActiveAuditor, activeAuditor } = useAuthStore();


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
    const result = useQuery<LoginSuccessDto>({
      queryKey: ["get-active-auditor-details"] as const,
      queryFn: async (): Promise<LoginSuccessDto> => service.getProfile(),
      placeholderData: (prev) => prev,
      enabled: !activeAuditor?.id
    });

    useEffect(() => {
      if (result.data) {
        setActiveAuditor(result.data);
      }
    }, [result.status, result.data]);

    return result;
  };

  const useRefreshToken = () =>
    useMutation({
      mutationFn: () =>
        service.refreshToken(),
  });
    
  const useLogout = () =>
    useMutation({
      mutationFn: () =>
        service.logout(),
  });
    
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
