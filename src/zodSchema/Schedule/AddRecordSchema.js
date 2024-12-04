import { z } from "zod";

export const addRecordSchema = z.object({
  parents: z
    .array(
      z.object({
        parentFirstName: z.string().min(1, "Parent's first name is required"), // Parent first name is required
        parentLastName: z.string().min(1, "Parent's last name is required"), // Parent last name is required
        parentContactNumber: z
          .string()
          .min(1, "Parent's contact number is required")
          .regex(/^[0-9]{11}$/, "Contact number must be exactly 11 digits."),
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
