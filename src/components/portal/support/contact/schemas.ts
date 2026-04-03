import { z } from "zod";

export const contactFormSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  message: z.string().min(1, "Message is required"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
