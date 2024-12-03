import { z } from "zod";

// Zod schema for form validation
export const manualAttendEventsSchema = z.object({
  parents: z
    .array(
      z.object({
        id: z.string(), // Make sure the id is required
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        contact_number: z.string().optional(),
        family_id: z.string().optional(),
      })
    )
    .optional(),
  children: z
    .array(
      z.object({
        id: z.string(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        family_id: z.string().optional(),
      })
    )
    .min(1, { message: "Please select at least one child" }),
});
