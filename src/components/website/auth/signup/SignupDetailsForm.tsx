"use client"

import { Loader2 } from 'lucide-react'
import { Button } from '@components/3rdparty/ui/button'
import { Input } from '@components/3rdparty/ui/input'
import { PasswordInput } from '../PasswordInput'
import { TrustBadge } from '../TrustBadge'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthQueries } from '../libs/useAuthQueries'
import { CreateUserDto } from '@components/admin/user/models'
import { FormField } from '@components/ui/form/FormField'
import zxcvbn from 'zxcvbn'
import { useAuthStore } from '../libs/useAuthStore'
import { EmailSource } from '../models'

/* ---------------- Schema ---------------- */

const detailsSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

type FormValues = z.infer<typeof detailsSchema>

const STORAGE_KEY = 'veriprops-signup-details-draft'

/* ---------------- Component ---------------- */
type SignupDetailsFormProps = {
  firstname?: string
  lastname?: string
}

export default function SignupDetailsForm({firstname='', lastname=''}: SignupDetailsFormProps) {
  const router = useRouter()
  const {createUserPayload} = useAuthStore();
  const { useCreateUser } = useAuthQueries()
  const createUser = useCreateUser()
  const[errorMessage, setErrorMessage] = useState<string | null>();
  const[isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(detailsSchema),
    mode: 'onChange',
    defaultValues: {
      firstname: firstname,
      lastname: lastname,
      password: '',
      confirmPassword: ''
    }
  })

  const { watch, handleSubmit, reset, formState } = form
  const password = watch('password')

  /* -------- Persist to localStorage -------- */

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) reset(JSON.parse(saved))
  }, [reset])

  useEffect(() => {
    setErrorMessage(null)
    const sub = watch(values => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    })
    return () => sub.unsubscribe()
  }, [watch])

  /* -------- Password strength -------- */

  const strength = password ? zxcvbn(password) : null

  const strengthLabel = ['Very weak', 'Weak', 'Okay', 'Good', 'Strong']

  /* -------- Submit -------- */

  const onSubmit = (data: FormValues) => {
    setErrorMessage(null)
    setIsSubmitting(true)
    localStorage.removeItem(STORAGE_KEY)

    const payload: CreateUserDto = {
                phone: createUserPayload.phone,
                phoneOtp: createUserPayload.phoneOtp ?? "",
                email: createUserPayload.email ?? "",
                emailSource: createUserPayload.emailSource || EmailSource.EMAIL_LOGIN,
                emailOtp: createUserPayload.emailOtp ?? "",
                password: data.password,
                firstname: data.firstname,
                lastname: data.lastname,
            };

    createUser.mutate(payload, {
      onSuccess: () => {
        setIsSubmitting(false)
        router.push('/portal/dashboard')
      },
      onError: (error) => {
        setIsSubmitting(false)
        const errorMessage = error.message || 'Failed to send verification code'
        setErrorMessage(errorMessage)
      }
    })
  }

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">
          Complete your account
        </h1>
        <p className="text-muted-foreground">
          Enter your details to finish creating your secure Veriprops account.
        </p>
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <FormField name="firstname" label="First name">
              <Input autoComplete="given-name" />
            </FormField>

            <FormField name="lastname" label="Last name">
              <Input autoComplete="family-name" />
            </FormField>
          </div>

          <FormField name="password" label="Password">
            <PasswordInput autoComplete="new-password" />
          </FormField>

          {strength && password.length > 0 && (
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Password strength</span>
                <span className="font-medium">
                  {strengthLabel[strength.score]}
                </span>
              </div>
              <div className="h-1 rounded bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(strength.score + 1) * 20}%` }}
                />
              </div>
            </div>
          )}

          <FormField name="confirmPassword" label="Confirm password">
            <PasswordInput autoComplete="new-password" />
          </FormField>

          <Button
            type="submit"
            className="w-full"
            disabled={!formState.isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create secure account'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By creating an account, you agree to Veriprops’ Terms and Privacy Policy.
          </p>

          <TrustBadge variant="documents" />
        </form>
      </FormProvider>
    </>
  )
}
