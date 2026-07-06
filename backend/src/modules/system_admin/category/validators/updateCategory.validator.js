import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateCategoryValidator = z.object({
  body: z.object({
    name: demoValidator.chuoi("Tên loại hình nhà hàng", 2).optional(),
    description: z.string().optional(),
    bgColor: z.string().optional(),
    textColor: z.string().optional(),
    isActive: z.boolean().optional(),
  })
});
