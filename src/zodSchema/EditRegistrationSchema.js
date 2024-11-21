import { z } from "zod";

export const editRegistrationSchema = z.object({
  registrationCode: z
    .string({
      required_error: "Registration code is required.",
      invalid_type_error: "Registration code must be a string.",
    })
    .refine((value) => /^[0-9]{6}$/.test(value), {
      message: "Registration code must be exactly 6 digits and numeric.",
    }),
});