import { z } from "zod";

export const editRegistrationSchema = z.object({
  registrationCode: z
    .string({
      required_error: "Registration code is required.",
      invalid_type_error: "Registration code must be a string.",
    })
    .trim()
    .min(1, "Registration code cannot be empty.") // Ensure it's not empty after trimming
    .length(6, "Registration code must be exactly 6 characters."), // Ensure it's exactly 6 characters
});