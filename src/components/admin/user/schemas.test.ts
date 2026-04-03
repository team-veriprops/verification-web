import { describe, it, expect } from "vitest";
import { inviteSchema } from "./schemas";

describe("inviteSchema", () => {
  const valid = {
    firstname: "John",
    lastname: "Doe",
    email: "john@example.com",
    role: "admin",
  };

  it("should pass when all fields are valid", () => {
    expect(inviteSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail when firstname is empty", () => {
    const result = inviteSchema.safeParse({ ...valid, firstname: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("First name is required");
  });

  it("should fail when lastname is empty", () => {
    const result = inviteSchema.safeParse({ ...valid, lastname: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Last name is required");
  });

  it("should fail when email is not a valid email address", () => {
    const result = inviteSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid email address");
  });

  it("should fail when role is empty", () => {
    const result = inviteSchema.safeParse({ ...valid, role: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Role is required");
  });

  it("should fail when required fields are missing", () => {
    expect(inviteSchema.safeParse({}).success).toBe(false);
  });
});
