import { z } from "zod";

const allowedMimeTypes = ["image/jpeg", "image/png"];

export const editEventSchema = z
  .object({
    eventName: z.string().min(2, {
      message: "Event name is required.",
    }),

    eventDescription: z.string().optional().default(""),

    eventVisibility: z
      .string()
      .min(1, { message: "Event visibility is required." })
      .refine((value) => ["public", "private"].includes(value), {
        message: "Event visibility must be either public or private.",
      }),

    eventDate: z
      .union([
        z
          .date({
            invalid_type_error: "Please provide a valid date.",
          })
          .refine(
            (date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date >= today;
            },
            {
              message: "Date must not be in the past.",
            }
          ),
        z.null(),
      ])
      .refine((val) => val !== null, {
        message: "Date is required.",
      }),

    // eventTime validation (only required if eventObservation is false)
    eventTime: z
      .union([
        z.date().refine((date) => !isNaN(date.getTime()), {
          message: "Please provide a valid time.",
        }),
        z.string().refine((str) => str.trim().length > 0, {
          message: "Required.",
        }),
        z.null(),
      ])
      .optional(),

    eventObservation: z.boolean(),

    ministry: z.string().optional(),
    groups: z.string().optional(),

    eventPosterImage: z
      .union([
        z
          .instanceof(File)
          .refine(
            (file) => file.size <= 5 * 1024 * 1024,
            "Image size must be less than 5MB"
          )
          .refine(
            (file) => allowedMimeTypes.includes(file.type),
            "Invalid file type. Allowed: jpg, jpeg, png"
          ),
        z.string(), // For URLs
        z.null(), // For no image
        z.undefined(), // For optional
      ])
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Check if eventVisibility is filled, and add errors for empty fields
    if (!data.eventVisibility) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Event visibility is required.",
        path: ["eventVisibility"],
      });
    }

    // Validate ministry and groups for private events
    if (data.eventVisibility === "private") {
      if (!data.ministry) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required",
          path: ["ministry"],
        });
      }
      if (!data.groups) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required",
          path: ["groups"],
        });
      }
    }

    // Validate time and volunteers for non-observation events
    if (data.eventObservation) {
      // Validate eventTime (eventTime is required when eventObservation is false)
      const isValidEventTime =
        data.eventTime &&
        ((data.eventTime instanceof Date && !isNaN(data.eventTime.getTime())) ||
          (typeof data.eventTime === "string" &&
            data.eventTime.trim().length > 0));

      if (!isValidEventTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Time is required.",
          path: ["eventTime"],
        });
      }
    }
  });
