import { z } from "zod";

export const editParentSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  contactNumber: z.string().regex(/^(\+44|44|0)?\d{10}$/, {
    message:
      "Contact number must be a valid phone number with exactly 11 digits.",
  }),
});
