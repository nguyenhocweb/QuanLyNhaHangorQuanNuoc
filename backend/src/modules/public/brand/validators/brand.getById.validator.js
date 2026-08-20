import { demoValidator } from "../../../../core/utils/validator.js";

import { z } from "zod";

const getPublicBrandByIdValidator = z.object({
    params: z.object({
        _id: demoValidator.chuoi("ID Thương hiệu")
    })
});

export default getPublicBrandByIdValidator;
