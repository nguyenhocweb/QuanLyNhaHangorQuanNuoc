import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateBrandTemplateValidator = z.object({
    body: z.object({
        templateId: demoValidator.chuoi("Template ID").regex(/^[0-9a-fA-F]{24}$/, "Template ID không hợp lệ"),
    }),
});
