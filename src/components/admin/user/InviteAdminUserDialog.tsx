"use client";

import { useEffect, useState } from "react";
import { Button } from "@3rdparty/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@3rdparty/ui/dialog";
import { Input } from "@3rdparty/ui/input";
import { Mail, UserPlus } from "lucide-react";

import { useUserQueries } from "./libs/useUserQueries";
import { useRoleStore } from "./role/libs/useRoleStore";
import { useRoleQueries } from "./role/libs/useRoleQueries";
import { AsyncStateComponent } from "@components/ui/AsyncStateComponent";
import { useUserStore } from "./libs/useUserStore";
import { CreateInvitedUserDto } from "./models";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "@3rdparty/ui/use-toast";
import { getErrorMessage } from "@lib/utils";
import { FormField } from "@components/ui/form/FormField";
import { FormSelect } from "@components/ui/form/FormSelect";

const inviteSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function InviteAdminUserDialog() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const role_page_size = 100;

  const { updateFilters } = useRoleStore();
  const { currentUser } = useUserStore();

  const { useSearchRolePage } = useRoleQueries();
  const { data: dataPage, isLoading, isError } =
    useSearchRolePage(currentUser?.id ?? "");

  useEffect(() => {
    updateFilters({ pageSize: role_page_size });
  }, [role_page_size, updateFilters]);

  const { useInviteAdminUser } = useUserQueries();
  const inviteAdminUser = useInviteAdminUser();

  const methods = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      role: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: InviteFormValues) => {
    setApiError(null);

    const payload: CreateInvitedUserDto = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      role: data.role,
    };

    inviteAdminUser.mutate(payload, {
      onSuccess: () => {
        reset();
        setIsModalOpen(false);

        toast({
          title: "Invitation sent",
          description: `${data.firstname} ${data.lastname} has been invited successfully.`,
        });
      },
      onError: (error: Error) => {
        const message = getErrorMessage(error, "Failed to send invitation");
        setApiError(message);

        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Team Member
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New Team Member</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Names */}
            <div className="flex gap-2">
              <div className="flex-1">
                <FormField name="firstname" label="First name">
                  <Input autoComplete="given-name" />
                </FormField>
              </div>

              <div className="flex-1">
                <FormField name="lastname" label="Last name">
                  <Input autoComplete="family-name" />
                </FormField>
              </div>
            </div>

            {/* Email */}
            <FormField name="email" label="Email Address">
              <Input type="email" />
            </FormField>

            {/* Role */}
            <AsyncStateComponent
              isLoading={isLoading}
              isError={isError}
              data={dataPage}
              loadingText="Loading roles..."
              errorText="Failed to load roles, please try again later."
              emptyText="No roles found."
            >
              {() => (
                <FormSelect
                  name="role"
                  label="Assigned Role"
                  placeholder="Select role"
                  options={
                    dataPage?.items.map((role) => ({
                      label: role.name,
                      value: role.name,
                    })) ?? []
                  }
                />
              )}
            </AsyncStateComponent>

            {/* API Error */}
            {apiError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {apiError}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                <Mail className="h-4 w-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
