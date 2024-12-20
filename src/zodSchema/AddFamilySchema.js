import * as z from "zod";

export const addFamilySchema = z.object({
  parents: z
    .array(
      z.object({
        firstName: z.string().min(1, "First Name is required"),
        lastName: z.string().min(1, "Last Name is required"),
        contactNumber: z.string().regex(/^[0-9]{11}$/, {
          message: "Contact number must be exactly 11 digits.",
        }),
      })
    )
    .min(1, "At least one parent is required"),
  children: z.array(
    z.object({
      firstName: z.string().min(1, "First Name is required"),
      lastName: z.string().min(1, "Last Name is required"),
    })
  ),
});


export const parentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  contact_number: z.string().regex(/^[0-9]{11}$/, {
    message: "Contact number must be exactly 11 digits.",
  }),
});
export const childSchema = parentSchema.omit({ contact_number: true });