import { z } from "zod";
import { MeasurementUnit, PropertyType, TransactionCurrency } from "types/models";

export const step1Schema = z.object({
  propertyType: z.enum(PropertyType, {
    error: () => ({ message: "Please select a property type" }),
  }),

  propertyTitle: z
    .string()
    .min(5, "Property title must be at least 5 characters"),

  propertyPlotSize: z
    .string()
    .min(1, "Plot size is required")
    .refine((v) => Number(v) > 0, "Plot size must be greater than zero"),

  propertyPlotSizeUnit: z.enum(MeasurementUnit, {
    error: () => ({ message: "Please select a plot size unit" }),
  }),

  propertyEstimatedPrice: z
    .string()
    .min(1, "Estimated price is required")
    .refine((v) => Number(v) > 0, "Price must be greater than zero"),

  currency: z.enum(TransactionCurrency, {
    error: () => ({ message: "Please select a currency" }),
  }),
});

export const step4Schema = z.object({
  ownerFullName: z.string().min(3, "Owner name must be at least 3 characters"),

  sellerFullName: z
    .string()
    .min(3, "Seller name must be at least 3 characters"),

  sellerCompany: z.string().optional(),

  sellerEmail: z.string().email("Please enter a valid email"),

  sellerPhone: z.string().min(10, "Please enter a valid phone number"),

  surveyPlanNumber: z.string().optional(),

  beaconNumbers: z.string().optional(),

  additionalDetails: z.string().optional(),
});

export const propertyFormSchema = step1Schema.and(step4Schema);

export type PropertyFormData = z.infer<typeof propertyFormSchema>;
