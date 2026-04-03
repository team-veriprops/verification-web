import { describe, it, expect } from "vitest";
import { detailsSchema } from "./schemas";

describe("detailsSchema", () => {
  const valid = {
    firstname: "John",
    lastname: "Doe",
    password: "password123",
    confirmPassword: "password123",
  };

  it("should pass when all fields are valid and passwords match", () => {
    expect(detailsSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail when firstname is shorter than 2 characters", () => {
    const result = detailsSchema.safeParse({ ...valid, firstname: "J" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "First name must be at least 2 characters"
    );
  });

  it("should fail when lastname is shorter than 2 characters", () => {
    const result = detailsSchema.safeParse({ ...valid, lastname: "D" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Last name must be at least 2 characters"
    );
  });

  it("should fail when password is shorter than 8 characters", () => {
    const result = detailsSchema.safeParse({
      ...valid,
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Password must be at least 8 characters"
    );
  });

  it("should fail when confirmPassword does not match password", () => {
    const result = detailsSchema.safeParse({
      ...valid,
      confirmPassword: "differentPassword",
    });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find(
      (i) => i.path[0] === "confirmPassword"
    );
    expect(issue?.message).toBe("Passwords don't match");
  });

  it("should pass when passwords match exactly", () => {
    expect(
      detailsSchema.safeParse({ ...valid, password: "MyP@ssw0rd", confirmPassword: "MyP@ssw0rd" }).success
    ).toBe(true);
  });
});
