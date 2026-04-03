"use client";

import { useEffect, useState } from "react";
import { Button } from "@3rdparty/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@3rdparty/ui/dialog";
import { Input } from "@3rdparty/ui/input";
import { MultiSelect } from "@3rdparty/ui/multi-select";
import { Plus, Settings } from "lucide-react";

import { CreateRoleDto, SystemRole } from "./models";
import { AsyncStateComponent } from "@components/ui/AsyncStateComponent";
import { useRoleQueries } from "./libs/useRoleQueries";
import { useRoleStore } from "./libs/useRoleStore";

import { useForm, FormProvider, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "@3rdparty/ui/use-toast";
import { getErrorMessage } from "@lib/utils";
import { FormField } from "@components/ui/form/FormField";

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  systemRoles: z.array(z.string()).min(1, "Select at least one permission"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export default function CreateRoleDialog() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const role_page_size = 100;

  const { updateFilters } = useRoleStore();
  const { useSearchRolePage, useCreateRole } = useRoleQueries();

  const { data: dataPage, isLoading, isError } = useSearchRolePage();

  useEffect(() => {
    updateFilters({ pageSize: role_page_size });
  }, [role_page_size, updateFilters]);

  const createRole = useCreateRole();

  const methods = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      systemRoles: [],
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: RoleFormValues) => {
    setApiError(null);

    const payload: CreateRoleDto = {
      name: data.name,
      description: data.description || "",
      systemRoles: data.systemRoles as SystemRole[],
    };

    createRole.mutate(payload, {
      onSuccess: () => {
        reset();
        setIsModalOpen(false);

        toast({
          title: "Role created",
          description: `${data.name} has been created successfully.`,
        });
      },
      onError: (error: Error) => {
        const message = getErrorMessage(error, "Failed to create role");
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
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          reset();
          setApiError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Create a custom role and assign system permissions to it.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField name="name" label="Role Name">
              <Input placeholder="e.g. Manager" autoFocus />
            </FormField>

            {/* Description */}
            <FormField name="description" label="Description">
              <Input placeholder="Role description" />
            </FormField>

            {/* System Roles */}
            <AsyncStateComponent
              isLoading={isLoading}
              isError={isError}
              data={dataPage}
              loadingText="Loading system roles..."
              errorText="Failed to load system roles, please try again later."
              emptyText="No system roles found."
            >
              {(data) => {
                const allSystemRoles = data.items
                  .filter((role) => role.isSystemRole)
                  .map((role) => role.name);

                return (
                  <Controller
                    name="systemRoles"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="text-sm font-medium">
                          System Role Permissions
                        </label>
                        <MultiSelect
                          options={allSystemRoles}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select permissions"
                        />
                      </div>
                    )}
                  />
                );
              }}
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

              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                <Settings className="h-4 w-4 mr-2" />
                {isSubmitting ? "Creating..." : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
