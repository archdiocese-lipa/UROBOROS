import { z } from "zod";

const createMinistrySchema = z.object({
  coordinators: z.array(z.string())   .min(1, "At least one coordinator must be selected"),
  ministryName: z.string().min(1, "Ministry name is required"),
  ministryDescription: z
    .string()
    .max(128, "Ministry description must be 128 characters or less")
    .optional(),
});


const coordinatorSchema = createMinistrySchema.pick({
  coordinators:true
})


export {
  createMinistrySchema,
  coordinatorSchema
}
