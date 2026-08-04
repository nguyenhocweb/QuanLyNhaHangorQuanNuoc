import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updateRestaurantTemplateValidator = z.object({
    body: z.object({
        templateId: demoValidator.chuoi("Template ID"),
    })
});
