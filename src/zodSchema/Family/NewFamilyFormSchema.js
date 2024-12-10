import { z } from "zod";

export const newFamilySchema = z.object({
  first_name: z.string().min(1, "First Name is Required"),
  last_name: z.string().min(1, "Last Name is Required"),
  type: z.string().min(1, "Type is Required"),
  contact_number: z
    .string()
    .optional()
    .refine(
      (value) => {
        // If it's not a guardian, we skip validation for contact_number
        if (!value) return true; // If no contact number, pass it
        if (/^[0-9+]+$/.test(value)) return true; // Validate if it's a number or starts with +
        return false; // Invalid if not a number or +
      },
      {
        message: "Contact Tel No. must be a number or start with +.",
      }
    )
    .refine(
      (value) => {
        if (!value) return true; // Skip length check if no value
        return value.replace(/^\+44|^44|^0/, "").length === 10; // Ensure 10 digits after removing prefix
      },
      {
        message: "Contact Tel No. must be exactly 11 digits including prefix.",
      }
    )
    .refine(
      (value) => {
        if (!value) return true; // Skip regex check if no value
        return /^(\+44|44|0)?\d{10}$/.test(value); // Validate UK phone number pattern
      },
      {
        message:
          "Contact number must be a valid phone number with exactly 11 digits.",
      }
    ),
});
