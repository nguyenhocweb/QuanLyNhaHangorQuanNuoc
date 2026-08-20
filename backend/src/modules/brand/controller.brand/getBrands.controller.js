import asyncHandler from "../../../core/utils/asyncHandler.js";
import { getBrandsService } from "../service.brand/getBrands.service.js";
import {NotFoundError} from "../../../core/constants/error/index.js"
export const getBrandsController=asyncHandler(
    async(req,res)=>{
       const page=parseInt(req.query.page);
       const limit=parseInt(req.query.limit);
       const result=await getBrandsService(page,limit); 
       switch (result.code) {
        case 404:
            throw new NotFoundError(result.mes)
        case 200:
            res.status(200).json(result.data)
      
       }
    }
)