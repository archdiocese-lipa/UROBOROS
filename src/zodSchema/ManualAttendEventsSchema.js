import { z } from "zod";

// Zod schema for form validation
export const manualAttendEventsSchema = z.object({
  parents: z
    .array(
      z.object({
        id: z.string().optional(),
      })
    )
    .optional(),
  children: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .min(1, { message: "Please select at least one child" }),
});
