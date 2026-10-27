import { z } from "zod";

export const reviewStatusSchema = z.object({
    is_public: z.boolean()
});

export type ReviewStatusFormValues = z.infer<typeof reviewStatusSchema>;
