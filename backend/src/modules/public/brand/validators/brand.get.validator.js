import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

const getPublicBrandsValidator = z.object({
    query: z.object({
        page: z.string().optional().default("1"),
        limit: z.string().optional().default("10"),
        search: z.string().optional()
    })
});

export default getPublicBrandsValidator;
