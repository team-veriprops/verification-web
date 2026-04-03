import { describe, it, expect } from "vitest";
import { passwordSchema } from "./schemas";

describe("passwordSchema", () => {
  const valid = {
    oldPassword: "OldPass1!",
    newPassword: "NewPass1!",
    confirmPassword: "NewPass1!",
  };

  it("should pass when all passwords are valid and new passwords match", () => {
    expect(passwordSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail when oldPassword is empty", () => {
    const result = passwordSchema.safeParse({ ...valid, oldPassword: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Current password is required");
  });

  it("should fail when newPassword is shorter than 8 characters", () => {
    const result = passwordSchema.safeParse({
      ...valid,
      newPassword: "Sh0rt!",
      confirmPassword: "Sh0rt!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Password must be at least 8 characters"
    );
  });

  it("should fail when newPassword does not contain a number", () => {
    const result = passwordSchema.safeParse({
      ...valid,
      newPassword: "NoNumbers!",
      confirmPassword: "NoNumbers!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Password must contain at least one number"
    );
  });

  it("should fail when newPassword does not contain a symbol", () => {
    const result = passwordSchema.safeParse({
      ...valid,
      newPassword: "NoSymbols1",
      confirmPassword: "NoSymbols1",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Password must contain at least one symbol"
    );
  });

  it("should fail when confirmPassword does not match newPassword", () => {
    const result = passwordSchema.safeParse({
      ...valid,
      confirmPassword: "DifferentPass1!",
    });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find(
      (i) => i.path[0] === "confirmPassword"
    );
    expect(issue?.message).toBe("Passwords don't match");
  });

  it("should pass when newPassword meets all complexity requirements", () => {
    expect(
      passwordSchema.safeParse({
        ...valid,
        newPassword: "C0mpl3x!Pass",
        confirmPassword: "C0mpl3x!Pass",
      }).success
    ).toBe(true);
  });
});
