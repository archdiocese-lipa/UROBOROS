import { z } from "zod";

export const createMeetingSchema = z.object({
  meetingName: z.string().min(1, "Meeting title is required"),
  participants: z
    .array(z.string())
    .min(1, "At least one participant is required"),
  location: z.string().optional(),
  date: z
    .instanceof(Date, { message: "Please select a valid event date." }) // Ensures it's a Date object
    .refine((date) => !isNaN(date.getTime()), {
      message: "Please insert an event date.",
    }).refine((date) => date >= new Date(),{message:"Date must not be in the past."}),
  time: z
    .instanceof(Date, { message: "Event Time must be a valid Date object." })
    .refine((date) => date.getHours() >= 0 && date.getHours() < 24, {
      message: "Please insert time.",
    }),
  details: z.string().optional(),
});
