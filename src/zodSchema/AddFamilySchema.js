import * as z from "zod";

export const addFamilySchema = z.object({
  parentFirstName: z
    .string()
    .min(1, "Parent's first name is required")
    .max(50, "Parent's first name must not exceed 50 characters"),
  parentLastName: z
    .string()
    .min(1, "Parent's last name is required")
    .max(50, "Parent's last name must not exceed 50 characters"),
  childFirstName: z
    .string()
    .min(1, "Child's first name is required")
    .max(50, "Child's first name must not exceed 50 characters"),
  childLastName: z
    .string()
    .min(1, "Child's last name is required")
    .max(50, "Child's last name must not exceed 50 characters"),
});
