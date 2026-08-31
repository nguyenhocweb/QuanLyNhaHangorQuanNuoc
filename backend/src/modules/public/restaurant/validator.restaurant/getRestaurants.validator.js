import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export default z.object({
    query: z.object({
        page: demoValidator.int("page", 1, 255).optional().default(1),
        limit: demoValidator.int("limit", 1, 255).optional().default(10),
        city: z.string().optional(),
        search: z.string().optional(),
        idBrand: z.string().optional(),
        category: z.string().optional(),
        review: z.string().optional(),
    }),
});
