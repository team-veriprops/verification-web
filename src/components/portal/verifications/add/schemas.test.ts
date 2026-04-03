import { describe, it, expect } from "vitest";
import { step1Schema, step4Schema, propertyFormSchema } from "./schemas";
import { MeasurementUnit, PropertyType, TransactionCurrency } from "types/models";

describe("step1Schema", () => {
  const valid = {
    propertyType: PropertyType.LAND,
    propertyTitle: "Plot at Lekki Phase 1",
    propertyPlotSize: "500",
    propertyPlotSizeUnit: MeasurementUnit.SQM,
    propertyEstimatedPrice: "50000000",
    currency: TransactionCurrency.NGN,
  };

  it("should pass when all property detail fields are valid", () => {
    expect(step1Schema.safeParse(valid).success).toBe(true);
  });

  it("should fail when propertyType is not a recognised enum value", () => {
    const result = step1Schema.safeParse({ ...valid, propertyType: "warehouse" });
    expect(result.success).toBe(false);
  });

  it("should fail when propertyTitle is shorter than 5 characters", () => {
    const result = step1Schema.safeParse({ ...valid, propertyTitle: "Plot" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Property title must be at least 5 characters"
    );
  });

  it("should fail when propertyPlotSize is empty", () => {
    const result = step1Schema.safeParse({ ...valid, propertyPlotSize: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Plot size is required");
  });

  it("should fail when propertyPlotSize is zero", () => {
    const result = step1Schema.safeParse({ ...valid, propertyPlotSize: "0" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Plot size must be greater than zero"
    );
  });

  it("should fail when propertyPlotSizeUnit is not a recognised enum value", () => {
    const result = step1Schema.safeParse({ ...valid, propertyPlotSizeUnit: "miles" });
    expect(result.success).toBe(false);
  });

  it("should fail when propertyEstimatedPrice is empty", () => {
    const result = step1Schema.safeParse({ ...valid, propertyEstimatedPrice: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Estimated price is required");
  });

  it("should fail when propertyEstimatedPrice is zero", () => {
    const result = step1Schema.safeParse({ ...valid, propertyEstimatedPrice: "0" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Price must be greater than zero");
  });

  it("should fail when currency is not a recognised enum value", () => {
    const result = step1Schema.safeParse({ ...valid, currency: "BTC" });
    expect(result.success).toBe(false);
  });

  it("should pass for all valid PropertyType values", () => {
    for (const type of Object.values(PropertyType)) {
      expect(step1Schema.safeParse({ ...valid, propertyType: type }).success).toBe(true);
    }
  });

  it("should pass for all valid MeasurementUnit values", () => {
    for (const unit of Object.values(MeasurementUnit)) {
      expect(step1Schema.safeParse({ ...valid, propertyPlotSizeUnit: unit }).success).toBe(true);
    }
  });

  it("should pass for all valid TransactionCurrency values", () => {
    for (const currency of Object.values(TransactionCurrency)) {
      expect(step1Schema.safeParse({ ...valid, currency }).success).toBe(true);
    }
  });
});

describe("step4Schema", () => {
  const valid = {
    ownerFullName: "Emeka Okafor",
    sellerFullName: "Tunde Bello",
    sellerEmail: "tunde@example.com",
    sellerPhone: "08012345678",
  };

  it("should pass when all required ownership fields are valid", () => {
    expect(step4Schema.safeParse(valid).success).toBe(true);
  });

  it("should pass when optional fields are also provided", () => {
    expect(
      step4Schema.safeParse({
        ...valid,
        sellerCompany: "Bello Properties Ltd",
        surveyPlanNumber: "LSP/2024/001",
        beaconNumbers: "BN001, BN002",
        additionalDetails: "Corner piece",
      }).success
    ).toBe(true);
  });

  it("should fail when ownerFullName is shorter than 3 characters", () => {
    const result = step4Schema.safeParse({ ...valid, ownerFullName: "Em" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Owner name must be at least 3 characters"
    );
  });

  it("should fail when sellerFullName is shorter than 3 characters", () => {
    const result = step4Schema.safeParse({ ...valid, sellerFullName: "Tu" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Seller name must be at least 3 characters"
    );
  });

  it("should fail when sellerEmail is not a valid email address", () => {
    const result = step4Schema.safeParse({ ...valid, sellerEmail: "bad-email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Please enter a valid email");
  });

  it("should fail when sellerPhone is shorter than 10 characters", () => {
    const result = step4Schema.safeParse({ ...valid, sellerPhone: "080123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Please enter a valid phone number"
    );
  });
});

describe("propertyFormSchema (combined step1 + step4)", () => {
  const valid = {
    propertyType: PropertyType.RESIDENTIAL,
    propertyTitle: "5-Bedroom Duplex",
    propertyPlotSize: "300",
    propertyPlotSizeUnit: MeasurementUnit.SQM,
    propertyEstimatedPrice: "120000000",
    currency: TransactionCurrency.NGN,
    ownerFullName: "Emeka Okafor",
    sellerFullName: "Tunde Bello",
    sellerEmail: "tunde@example.com",
    sellerPhone: "08012345678",
  };

  it("should pass when all fields from both steps are valid", () => {
    expect(propertyFormSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail when a step1 field is invalid", () => {
    expect(
      propertyFormSchema.safeParse({ ...valid, propertyTitle: "Hi" }).success
    ).toBe(false);
  });

  it("should fail when a step4 field is invalid", () => {
    expect(
      propertyFormSchema.safeParse({ ...valid, sellerPhone: "123" }).success
    ).toBe(false);
  });
});
