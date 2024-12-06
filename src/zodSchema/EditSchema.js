import { z } from "zod";

export const EditSchema = z.object({
  event: z.string().min(1, "Event is required"),
  ticketCode: z
    .string() // Validate as a string
    .min(1, "Ticket code is required") // Ensure it's not empty
    .max(255, "Ticket code is too long"), // Optional: limit the length if needed (adjust length as per your needs)
  familyId: z
    .string()
    .uuid("Family ID must be a valid UUID") // Validate that it’s a UUID
    .optional(), // You can make it optional depending on your use case
  parents: z.array(
    z.object({
      parentFirstName: z.string().min(1, "Parent's first name is required"),
      parentLastName: z.string().min(1, "Parent's last name is required"),
      parentContactNumber: z
        .string()
        .min(1, "Parent's contact number is required")
        .regex(/^[0-9]{11}$/, "Contact number must be exactly 11 digits."),
      isMainApplicant: z.boolean(),
      id: z.string().uuid("Parent ID must be a valid UUID").optional(),
    })
  ),
  children: z
    .array(
      z.object({
        childFirstName: z.string().min(1, "Child's first name is required"),
        childLastName: z.string().min(1, "Child's last name is required"),
        id: z.string().uuid("Child ID must be a valid UUID").optional(),
      })
    )
    .min(1, "At least one child is required"),
});
