import { Card, CardContent, CardHeader, CardTitle } from "@3rdparty/ui/card";
import { Label } from "@3rdparty/ui/label";
import { Input } from "@3rdparty/ui/input";
import { Textarea } from "@3rdparty/ui/textarea";
import { Checkbox } from "@3rdparty/ui/checkbox";
import { DocumentUploadField } from "@components/ui/upload/DocumentUploadField";
import z from "zod";
import { MediaItem } from "@components/ui/upload/MediaCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/3rdparty/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/3rdparty/ui/form";
import { toast } from "@components/3rdparty/ui/use-toast";
import { QueryTaskDto } from "../../models";

interface RegistryFormProps {
  task: QueryTaskDto;
  canSubmit: boolean;
  handleSaveDraft: () => void;
}

const propertyFormSchema = z.object({
  registryRefNumber: z
    .string()
    .min(3, "Property name must be at least 3 characters"),
  stampNumber: z.string().min(5, "Address is required"),
  officerName: z.string().min(5, "Address is required"),
  matchCheck: z.boolean().refine((val) => val === true, {
    message: "You must confirm the property details match the registry records",
  }),
  registryNotes: z.string().optional(),
  documents: z
    .array(z.custom<MediaItem>())
    .min(1, "At least one document is required"),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export function RegistryForm({
  task,
  canSubmit,
  handleSaveDraft,
}: RegistryFormProps) {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      registryRefNumber: "",
      stampNumber: "",
      officerName: "",
      matchCheck: false,
      registryNotes: "",
      documents: [],
    },
  });

  // const updateField = (field: string, value: any) => {
  //   onChange({ ...data, [field]: value });
  // };

  const onSubmit = (data: PropertyFormValues) => {
    console.log("Form submitted:", data);

    const payload = {
      registryRefNumber: data.registryRefNumber,
      stampNumber: data.stampNumber,
      officerName: data.officerName,
      matchCheck: data.matchCheck,
      registryNotes: data.registryNotes,
      documents: data.documents.map((doc) => ({
        url: doc.uploadedUrl,
        filename: doc.filename,
        type: doc.metadata.type,
        title: doc.metadata.title,
        description: doc.metadata.description,
      })),
    };

    toast({
      title: "Property registered!",
      description: `${data.documents.length} document(s) uploaded successfully.`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-right">
            🏛 Registry Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              <FormField
                control={form.control}
                name="registryRefNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-sm">
                      Registry Reference Number *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-12 sm:h-10 text-base sm:text-sm"
                        placeholder="Official registry reference..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <div className="space-y-2">
            <Label htmlFor="registryRefNumber">
              Registry Reference Number *
            </Label>
            <Input
              id="registryRefNumber"
              placeholder="Official registry reference..."
              value={data.registryRefNumber || ""}
              // onChange={(e) => updateField("registryRefNumber", e.target.value)}
              required
            />
          </div> */}

              <FormField
                control={form.control}
                name="stampNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-sm">
                      Official Stamp Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-12 sm:h-10 text-base sm:text-sm"
                        placeholder="Stamp identification number..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <div className="space-y-2">
            <Label htmlFor="stampNumber">Official Stamp Number</Label>
            <Input
              id="stampNumber"
              placeholder="Stamp identification number..."
              value={data.stampNumber || ""}
              onChange={(e) => updateField("stampNumber", e.target.value)}
            />
          </div> */}

              <Label>Match Check *</Label>
              <FormField
                control={form.control}
                name="matchCheck"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-6 w-6 sm:h-5 sm:w-5"
                      />
                    </FormControl>

                    <div className="flex flex-col">
                      <FormLabel className="text-base sm:text-sm font-medium">
                        Property details match official registry records
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* <div className="space-y-2">
            <Label>Match Check *</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="matchCheck"
                checked={data.matchCheck || false}
                onCheckedChange={(checked) =>
                  updateField("matchCheck", checked)
                }
              />
              <Label htmlFor="matchCheck" className="font-normal">
                Property details match official registry records
              </Label>
            </div>
          </div> */}

              <FormField
                control={form.control}
                name="registryNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-sm">
                      Registry Notes *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="text-base sm:text-sm resize-none"
                        placeholder="Provide details about the registry verification..."
                        rows={3}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <div className="space-y-2">
                <Label htmlFor="registryNotes">Registry Notes *</Label>
                <Textarea
                  id="registryNotes"
                  placeholder="Provide details about the registry verification..."
                  value={data.registryNotes || ""}
                  onChange={(e) => updateField("registryNotes", e.target.value)}
                  rows={4}
                  required
                />
              </div> */}

              

              <FormField
                control={form.control}
                name="officerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-sm">
                      Verifying Officer
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-12 sm:h-10 text-base sm:text-sm"
                        placeholder="Officer name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DocumentUploadField
                control={form.control}
                name="documents"
                label="Required Documents *"
                // description="Upload all required property verification documents. Survey Plan and C of O are mandatory."
                requiredTypes={task.required_response}
                maxFiles={task.required_response.length}
                propertyId="property-123"
                placeholder="Tap to upload required documents"
              />

              {/* <div className="space-y-2">
            <Label htmlFor="officerName">Verifying Officer</Label>
            <Input
              id="officerName"
              placeholder="Officer name"
              value={data.officerName || ''}
              onChange={(e) => updateField('officerName', e.target.value)}
            />
          </div> */}

              {canSubmit && (
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="flex-1"
                  >
                    Save Draft
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Submit Task
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
