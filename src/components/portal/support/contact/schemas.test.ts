import { describe, it, expect } from "vitest";
import { contactFormSchema } from "./schemas";

describe("contactFormSchema", () => {
  const valid = { topic: "payment", message: "I need help with my payment." };

  it("should pass when topic and message are provided", () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail when topic is empty", () => {
    const result = contactFormSchema.safeParse({ ...valid, topic: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Topic is required");
  });

  it("should fail when message is empty", () => {
    const result = contactFormSchema.safeParse({ ...valid, message: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Message is required");
  });

  it("should fail when both fields are missing", () => {
    expect(contactFormSchema.safeParse({}).success).toBe(false);
  });
});
