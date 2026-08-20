import z from "zod";
import {demoValidator} from "../../../../core/utils/validator.js";
export default z.object({
    params:z.object({
        _id:demoValidator.chuoi("_id",1,255)
    })
})