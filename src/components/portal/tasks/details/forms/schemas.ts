import { z } from "zod";
import { MediaItem } from "@components/ui/upload/MediaCard";

export const propertyFormSchema = z.object({
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

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
