import { z } from "zod";

export const newFamilySchema = z
  .object({
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
          if (/^[0-9]+$/.test(value)) return true; // Validate if it's a number
          return false; // Invalid if not a number
        },
        {
          message: "Contact Tel No. must be a number.",
        }
      )
      .refine(
        (value) => {
          if (!value) return true; // Skip length check if no value
          return value.length === 11; // Ensure 11 digits
        },
        {
          message: "Contact Tel No. must be exactly 11 digits.",
        }
      ),
  })
  .refine(
    (data) => {
      if (data.type === "guardian" && !data.contact_number) {
        return false; // Contact number is required for guardians
      }
      return true;
    },
    {
      message: "Contact Tel No. is required.",
      path: ["contact_number"],
    }
  );
