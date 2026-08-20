 import { getDishsService } from "../service/getDishs.service.js";
 import asyncHandler from "../../../core/utils/asyncHandler.js";
 import {NotFoundError} from "../../../core/constants/error/index.js";
export const getDishsController=asyncHandler(
    async(req,res)=>{
        const page=parseInt( req.query.page);
        const limit=parseInt(req.query.limit);
        const result=await getDishsService(page,limit);
        switch (result.code) {
            case 404: throw new NotFoundError(result.mes);
            case 200:res.status(200).json(result.data);
        }
    }
)