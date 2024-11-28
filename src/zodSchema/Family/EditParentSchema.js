import { z } from "zod";

export const editParentSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  contactNumber: z.string().regex(/^[0-9]{11}$/, {
    message: "Contact number must be exactly 11 digits.",
  }),
});
