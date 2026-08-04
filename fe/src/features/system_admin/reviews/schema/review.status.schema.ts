import { z } from "zod";

export const reviewStatusSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED_SPAM"])
});

export type ReviewStatusFormValues = z.infer<typeof reviewStatusSchema>;
