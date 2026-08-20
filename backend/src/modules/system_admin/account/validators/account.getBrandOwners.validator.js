import { demoValidator } from "../../../../core/utils/validator.js";
import z from "zod";

export const getBrandOwnersValidator = z.object({
    query: z.object({
        search: demoValidator.chuoi("từ khóa tìm kiếm").optional()
    })
});

export default getBrandOwnersValidator;
