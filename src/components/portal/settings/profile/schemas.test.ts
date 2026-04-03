import { describe, it, expect } from "vitest";
import { profileSchema } from "./schemas";

describe("profileSchema", () => {
  const valid = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    country: "Nigeria",
    timezone: "GMT+1 (WAT)",
    currency: "NGN",
  };

  it("should pass when all required fields are valid", () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });

  it("should pass when optional phone is omitted", () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });

  it("should pass when phone is a valid international format", () => {
    expect(
      profileSchema.safeParse({ ...valid, phone: "+234 803 123 4567" }).success
    ).toBe(true);
  });

  it("should fail when firstName is empty", () => {
    const result = profileSchema.safeParse({ ...valid, firstName: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("First name is required");
  });

  it("should fail when lastName is empty", () => {
    const result = profileSchema.safeParse({ ...valid, lastName: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Last name is required");
  });

  it("should fail when email is not a valid email address", () => {
    const result = profileSchema.safeParse({ ...valid, email: "bad-email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid email format");
  });

  it("should fail when phone is provided but shorter than 10 characters", () => {
    const result = profileSchema.safeParse({ ...valid, phone: "12345" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid phone format");
  });

  it("should fail when country is empty", () => {
    const result = profileSchema.safeParse({ ...valid, country: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Country is required");
  });

  it("should fail when timezone is empty", () => {
    const result = profileSchema.safeParse({ ...valid, timezone: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Timezone is required");
  });

  it("should fail when currency is empty", () => {
    const result = profileSchema.safeParse({ ...valid, currency: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Currency is required");
  });
});
