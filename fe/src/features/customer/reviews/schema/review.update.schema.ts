import { z } from "zod";

export const reviewUpdateSchema = z.object({
    overall_rating: z.number().min(1).max(5).optional(),
    food_rating: z.number().min(1).max(5).optional(),
    service_rating: z.number().min(1).max(5).optional(),
    ambiance_rating: z.number().min(1).max(5).optional(),
    comment: z.string().max(1000, "Bình luận tối đa 1000 ký tự").optional(),
    images: z.array(z.string().url()).optional()
});

export type ReviewUpdateFormValues = z.infer<typeof reviewUpdateSchema>;
