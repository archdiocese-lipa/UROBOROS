import { z } from "zod";

export const EditRegisterSchema = z.object({
  event: z.string().min(1, "Event is required"), // Event selection is required
  eventId: z.string().uuid("Event ID must be a valid UUID"), // Event ID must be a valid UUID
  ticketCode: z.string().min(1, "Ticket code is required"), // Ticket code is required
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
        id: z.string().uuid("Parent ID must be a valid UUID").optional(), // ID is optional for updates
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
        id: z.string().uuid("Child ID must be a valid UUID").optional(), // ID is optional for updates
      })
    )
    .min(1, "At least one child is required"),
  removedParents: z
    .array(
      z.object({
        id: z.string().uuid("Parent ID must be a valid UUID"), // ID is required for removal
      })
    )
    .optional(), // Optional field to track removed parents
  removedChildren: z
    .array(
      z.object({
        id: z.string().uuid("Child ID must be a valid UUID"), // ID is required for removal
      })
    )
    .optional(), // Optional field to track removed children
});
