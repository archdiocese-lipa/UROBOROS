import { z } from "zod";

export const createMinistrySchema = z.object({
  ministryName: z.string().min(1, "Ministry name is required"),
  ministryDescription: z.string().optional(),
});
