import { z } from "zod";

export const assignMinistryMemberSchema = z.object({
  newMember: z
    .array(z.string())
    .min(1, "At least one participant is required"),
});
