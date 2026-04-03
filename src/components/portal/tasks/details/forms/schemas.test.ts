import { describe, it, expect } from "vitest";
import { propertyFormSchema } from "./schemas";

const makeDocument = (overrides = {}) => ({
  filename: "survey.pdf",
  uploadedUrl: "https://example.com/survey.pdf",
  metadata: { type: "survey", title: "Survey Plan", description: "" },
  ...overrides,
});

describe("propertyFormSchema (registry)", () => {
  const valid = {
    registryRefNumber: "REF-001",
    stampNumber: "STAMP-001",
    officerName: "Officer John",
    matchCheck: true,
    documents: [makeDocument()],
  };

  it("should pass when all required fields are valid and matchCheck is true", () => {
    expect(propertyFormSchema.safeParse(valid).success).toBe(true);
  });

  it("should pass when optional registryNotes is provided", () => {
    expect(
      propertyFormSchema.safeParse({ ...valid, registryNotes: "All good" }).success
    ).toBe(true);
  });

  it("should fail when registryRefNumber is shorter than 3 characters", () => {
    const result = propertyFormSchema.safeParse({ ...valid, registryRefNumber: "AB" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Property name must be at least 3 characters"
    );
  });

  it("should fail when stampNumber is shorter than 5 characters", () => {
    const result = propertyFormSchema.safeParse({ ...valid, stampNumber: "STM" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Address is required");
  });

  it("should fail when officerName is shorter than 5 characters", () => {
    const result = propertyFormSchema.safeParse({ ...valid, officerName: "Joe" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Address is required");
  });

  it("should fail when matchCheck is false", () => {
    const result = propertyFormSchema.safeParse({ ...valid, matchCheck: false });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "You must confirm the property details match the registry records"
    );
  });

  it("should fail when documents array is empty", () => {
    const result = propertyFormSchema.safeParse({ ...valid, documents: [] });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "At least one document is required"
    );
  });

  it("should pass when multiple documents are provided", () => {
    expect(
      propertyFormSchema.safeParse({
        ...valid,
        documents: [makeDocument(), makeDocument({ filename: "coo.pdf" })],
      }).success
    ).toBe(true);
  });
});
