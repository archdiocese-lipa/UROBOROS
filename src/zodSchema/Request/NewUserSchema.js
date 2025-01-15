import { z } from "zod";

export const newUserSchema = z
  .object({
    first_name: z.string().min(1, "First Name is Required"),
    last_name: z.string().min(1, "Last Name is Required"),
    contact_number: z.string().regex(/^(\+44|44|0)\d{10}$/, {
      message:
        "Contact number must be a valid phone number with exactly 11 digits.",
    }),
    email: z.string().email().min(1, "Email is Required"),
    role: z.string().min(1, "Role is Required"),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const editingUserSchema = z.object({
  first_name: z.string().min(1, "First Name is Required"),
  last_name: z.string().min(1, "Last Name is Required"),
  contact_number: z.string().regex(/^(\+44|44|0)\d{10}$/, {
    message:
      "Contact number must be a valid phone number with exactly 11 digits.",
  }),
  role: z.string().min(1, "Role is Required"),
});
