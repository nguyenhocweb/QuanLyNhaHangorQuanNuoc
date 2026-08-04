import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getBrandsService } from "../service.brand/getBrands.service.js";
import {NotFoundError} from "../../../../core/constants/error/index.js"
export const getBrandsController=asyncHandler(
    async(req,res)=>{
       const page=parseInt(req.query.page);
       const limit=parseInt(req.query.limit);
       const city=req.query.city;
       const search=req.query.search;
       const status=req.query.status;
       const isFeatured = req.query.isFeatured !== undefined ? req.query.isFeatured === 'true' || req.query.isFeatured === true : undefined;
       const isNew = req.query.isNew !== undefined ? req.query.isNew === 'true' || req.query.isNew === true : undefined;
       const result=await getBrandsService(page,limit,city,search,status,isFeatured,isNew); 
       switch (result.code) {
        case 404:
            throw new NotFoundError(result.mes)
        case 200:
           return  res.status(200).json(result.data)
           
      
       }
    }
)