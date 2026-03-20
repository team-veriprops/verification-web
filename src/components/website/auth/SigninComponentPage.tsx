"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@components/3rdparty/ui/button"
import { Input } from "@components/3rdparty/ui/input"
import { Label } from "@components/3rdparty/ui/label"
import { PasswordInput } from "./PasswordInput"
import { SocialAuthButtons } from "./SocialAuthButtons"
import { TrustBadge } from "./TrustBadge"
import { useUserQueries } from "../../admin/user/libs/useUserQueries"
import { LoginPayload, SocialAuthType } from "./models"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { FormField } from "@components/ui/form/FormField"

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type FormValues = z.infer<typeof signInSchema>

export default function SigninComponentPage() {
  const router = useRouter()
  const { useLogin } = useUserQueries()
  const login = useLogin()

  const [generalError, setGeneralError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {
    handleSubmit,
    formState: { isValid },
  } = form

  const isLoading = login.isPending

  const onSubmit = (data: FormValues) => {
    setGeneralError(null)

    const payload: LoginPayload = {
      username: data.email,
      password: data.password,
    }

    login.mutate(payload, {
      onSuccess: () => {
        router.push("/portal/dashboard")
      },
      onError: (error) => {
        setGeneralError(error?.message ?? "Invalid credentials")
      },
    })
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
          Sign In
        </h1>
        <p className="text-muted-foreground">
          Sign in to request, track, or review property verification reports.
        </p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* General Error */}
          {generalError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {generalError}
            </div>
          )}

          {/* Email */}
          <FormField name="email" label="Email address">
            <Input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading}
            />
          </FormField>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <FormField name="password">
              <PasswordInput
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </FormField>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Continue securely"
            )}
          </Button>

          <TrustBadge variant="security" />

          <SocialAuthButtons
            authType={SocialAuthType.LOGIN}
            isLoading={isLoading}
          />

          <p className="text-center text-sm text-muted-foreground pt-4">
            New to Veriprops?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </form>
      </FormProvider>
    </>
  )
}