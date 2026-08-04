import { z } from "zod";

export const getUnreviewedMealsValidator = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional()
    })
});
