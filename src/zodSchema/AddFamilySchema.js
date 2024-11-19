import * as z from "zod";

export const addFamilySchema = z.object({
  parents: z
    .array(
      z.object({
        firstName: z.string().nonempty("First Name is required"),
        lastName: z.string().nonempty("Last Name is required"),
      })
    )
    .min(1, "At least one parent is required"),
  children: z.array(
    z.object({
      firstName: z.string().nonempty("First Name is required"),
      lastName: z.string().nonempty("Last Name is required"),
    })
  ),
});
