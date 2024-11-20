import { z } from "zod";

export const createEventSchema = z.object({
  eventName: z.string().min(2, {
    message: "Event Name is required.",
  }),
  eventCategory: z
    .string()
    .min(1, { message: "Please select an event category." }),
  eventVisibility: z
    .string()
    .min(1, { message: "Please select an event visibility." }),
  ministry: z
    .string()
    .optional()
    .superRefine((data, ctx) => {
      if (data.eventVisibility === "ministry" && !data.ministry) {
        ctx.addIssue({
          path: ["ministry"],
          message: "Ministry is required when visibility is set to ministry.",
          code: z.ZodIssueCode.custom,
        });
      }
    }),
  eventDate: z
    .instanceof(Date, { message: "Please select a valid event date." }) // Ensures it's a Date object
    .refine((date) => !isNaN(date.getTime()), {
      message: "Please insert an event date.",
    }),
  eventTime: z
    .instanceof(Date, { message: "Event Time must be a valid Date object." })
    .refine((date) => date.getHours() >= 0 && date.getHours() < 24, {
      message: "Please insert time.",
    }),
  eventDescription: z.string().optional().default(""),
});
