import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateRestaurantAmenitiesValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID nhà hàng")
    }),
    body: z.object({
        amenityIds: z.array(demoValidator.chuoi("ID tiện ích")).optional(),
    })
});
