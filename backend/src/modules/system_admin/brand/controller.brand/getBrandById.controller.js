import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getBrandByIdService } from "../service.brand/getBrandById.server.js";
import {NotFoundError} from "../../../../core/constants/error/index.js"
export const getBrandByIdController=asyncHandler(
    async(req,res)=>{
        const _id=req.params._id;
        const result=await getBrandByIdService(_id);
        switch (result.code) {
            case 404:
                throw new NotFoundError(result.mes)
            case 200:
               return res.status(200).json(result.data)
                
        }
    }
)
