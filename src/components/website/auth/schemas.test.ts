import { describe, it, expect } from "vitest";
import { signInSchema, forgotPasswordSchema } from "./schemas";

describe("signInSchema", () => {
  const valid = { email: "user@example.com", password: "secret123" };

  it("should pass when email and password are valid", () => {
    expect(signInSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail when email is not a valid email address", () => {
    const result = signInSchema.safeParse({ ...valid, email: "bad-email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Please enter a valid email address"
    );
  });

  it("should fail when email is empty", () => {
    const result = signInSchema.safeParse({ ...valid, email: "" });
    expect(result.success).toBe(false);
  });

  it("should fail when password is empty", () => {
    const result = signInSchema.safeParse({ ...valid, password: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Password is required");
  });

  it("should fail when fields are missing", () => {
    expect(signInSchema.safeParse({}).success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("should pass when email is a valid email address", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "user@example.com" }).success
    ).toBe(true);
  });

  it("should fail when email is not a valid email address", () => {
    const result = forgotPasswordSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Please enter a valid email address"
    );
  });

  it("should fail when email is missing", () => {
    expect(forgotPasswordSchema.safeParse({}).success).toBe(false);
  });
});
