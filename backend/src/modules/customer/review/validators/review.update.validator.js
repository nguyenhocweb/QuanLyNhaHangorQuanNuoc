import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updateReviewValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID Đánh giá").regex(/^[0-9a-fA-F]{24}$/, "ID đánh giá không hợp lệ")
    }),
    body: z.object({
        overall_rating: z.number().min(1).max(5, "Đánh giá phải từ 1 đến 5 sao").optional(),
        food_rating: z.number().min(1).max(5).optional(),
        service_rating: z.number().min(1).max(5).optional(),
        ambiance_rating: z.number().min(1).max(5).optional(),
        comment: z.string().max(1000, "Bình luận tối đa 1000 ký tự").optional(),
        images: z.array(z.string().url("Đường dẫn ảnh không hợp lệ")).optional()
    })
});
