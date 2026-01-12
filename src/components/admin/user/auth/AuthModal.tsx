'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@components/3rdparty/ui/dialog';
import { useToast } from '@hooks/use-toast';
import { Button } from '@components/3rdparty/ui/button';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { authRequiredPathParamKey, authRequiredTypePathParamKey, httpClient } from 'containers';
import { RedirectResponse, SocialAuthType, SocialAuthProvider } from './models';
import { AuthService } from './libs/auth-service';

export function AuthModal() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [open, setOpen] = useState(false)
  const userService = new AuthService(httpClient)
  
  const params = new URLSearchParams(searchParams);
  const onOpenChange = () => {
    params.delete(authRequiredPathParamKey);
    params.delete(authRequiredTypePathParamKey);
    replace(`${pathname}?${params.toString()}`);

    setOpen(false)
  }

  useEffect(() => {
    const open = searchParams.get(authRequiredPathParamKey) === 'true'
    setOpen(open)
  }, [searchParams, searchParams.toString()])

  const initSocialLogin = async(provider: SocialAuthProvider) => {
    const operation_type = searchParams.get(authRequiredTypePathParamKey) === 'login' ? SocialAuthType.LOGIN: SocialAuthType.SIGNUP
    const server_response: RedirectResponse = await userService.initSocialLogin(provider, operation_type)
    window.location.href = server_response.redirectUrl
  }

//   const handleSocialLogin = async (provider: 'google' | 'facebook') => {
//     try {
//       setLoading(true);
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider,
//         options: {
//           redirectTo: `${window.location.origin}/onboarding`,
//         },
//       });

//       if (error) {
//         toast({
//           title: "Authentication Error",
//           description: error.message,
//           variant: "destructive",
//         });
//       } else {
//         onSuccess();
//       }
//     } catch (error) {
//       toast({
//         title: "Authentication Error",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Start Your Build
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to continue with your project onboarding
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 pt-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full cursor-pointer group"
            onClick={() => initSocialLogin(SocialAuthProvider.GOOGLE)}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
            <ExternalLink className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Button>
          
          {/* <Button
            variant="outline"
            size="lg"
            className="w-full cursor-pointer group"
            onClick={() => initSocialLogin(SocialAuthProvider.FACEBOOK, SocialAuthType.SIGNUP)}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
            <ExternalLink className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
