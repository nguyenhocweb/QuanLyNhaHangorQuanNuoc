import {demoValidator} from "../../../../core/utils/validator.js";
import {z} from "zod"
export default z.object({
    query:z.object({
        page:demoValidator.int("page",1,255),
        limit:demoValidator.int("limit",1,255),
        type:demoValidator.enum("type",["home","isBrand","isRestaurant"]),
        search:demoValidator.chuoi("search",0,255).optional(),
    }),
    params:z.object({
        _id:demoValidator.chuoi("_id",1,255).optional(),
    })
})