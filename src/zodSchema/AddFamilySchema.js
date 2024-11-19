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
