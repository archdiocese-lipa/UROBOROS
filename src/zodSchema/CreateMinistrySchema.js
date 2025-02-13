import { z } from "zod";

export const createMinistrySchema = z.object({
  // coordinators: z.array(z.string()),
  ministryName: z.string().min(1, "Ministry name is required"),
  ministryDescription: z
    .string()
    .max(128, "Ministry description must be 128 characters or less")
    .optional(),
});
