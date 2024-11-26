import { z } from "zod";


export const newFamilySchema = z.object({
    first_name: z.string().min(1, "First Name is Required"),
    last_name: z.string().min(1, "Last Name is Required"),
    type: z.string().min(1, "Type is Required"),
    contact_number: z
      .string()
      //   .regex(/^\d{11}$/, "Contact Number must be 11 digits")
      .optional(),
  });
  // .refine(
  //   (data) => {
  //     if (data.type === "guardian" && !data.contact_number) {
  //       return false; // Contact number is required for guardians
  //     }
  //     return true;
  //   },
  //   {
  //     message: "Contact Number is required for guardians.",
  //     path: ["contact_number"],
  //   }
  // );