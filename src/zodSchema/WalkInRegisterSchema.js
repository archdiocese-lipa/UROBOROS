import { z } from "zod";

export const walkInRegisterSchema = z.object({
  event: z.string().min(1, "Event is required"), // Event selection is required
  parents: z
    .array(
      z.object({
        parentFirstName: z.string().min(1, "Parent's first name is required"), // Parent first name is required
        parentLastName: z.string().min(1, "Parent's last name is required"), // Parent last name is required
        parentContactNumber: z
          .string()
          .min(1, "Parent's contact number is required")
          .regex(/^(\+44|44|0)\d{10}$/, {
            message:
              "Contact number must be a valid phone number with exactly 11 digits.",
          }),
        isMainApplicant: z.boolean(),
      })
    )
    .refine(
      (parents) => {
        // Ensure exactly one parent has isMainApplicant set to true
        const mainApplicants = parents.filter(
          (parent) => parent.isMainApplicant
        );
        return mainApplicants.length === 1;
      },
      {
        message: "There must be exactly one main applicant",
        path: ["parents"],
      }
    ),
  children: z
    .array(
      z.object({
        childFirstName: z.string().min(1, "Child's first name is required"), // Child first name is required
        childLastName: z.string().min(1, "Child's last name is required"), // Child last name is required
      })
    )
    .min(1, "At least one child is required"),
});
