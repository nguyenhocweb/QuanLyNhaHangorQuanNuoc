import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const reviewCreateSchema = z.object({
    reservationId: validator.string("Mã đặt bàn"),
    overall_rating: z.number().min(1).max(5),
    food_rating: z.number().min(1).max(5).optional(),
    service_rating: z.number().min(1).max(5).optional(),
    ambiance_rating: z.number().min(1).max(5).optional(),
    comment: z.string().max(1000, "Bình luận tối đa 1000 ký tự").optional(),
    images: z.array(z.string().url()).optional()
});

export type ReviewCreateFormValues = z.infer<typeof reviewCreateSchema>;
