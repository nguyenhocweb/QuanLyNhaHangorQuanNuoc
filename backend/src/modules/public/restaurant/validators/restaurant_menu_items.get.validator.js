import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const getPublicMenuItemsValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("Restaurant ID").regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ")
    }),
    query: z.object({
        page: demoValidator.int("Trang", 1).optional().default(1),
        limit: demoValidator.int("Giới hạn", 1).optional().default(6),
        search: demoValidator.chuoi("Từ khoá tìm kiếm").optional(),
        menuId: demoValidator.chuoi("Menu ID").regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ").optional(),
        categoryId: demoValidator.chuoi("Category ID").regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ").optional(),
    }),
});
