import { z } from "zod";

export const getSystemReviewsValidator = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        is_public: z.string().optional(),
        rating: z.string().optional(),
        restaurantId: z.string().optional(),
        brandId: z.string().optional(),
        search: z.string().optional()
    })
});
