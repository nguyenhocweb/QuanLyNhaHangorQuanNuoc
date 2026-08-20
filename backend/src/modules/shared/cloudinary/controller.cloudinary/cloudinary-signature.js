import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { cloudinarySignatureService } from "../service.cloudinary/cloudinarySignatureService.js";
export const cloudinarySignatureController=asyncHandler(
    async(req,res)=>{
        const {folder,public_id}=req.query
        const result=await cloudinarySignatureService(folder,public_id)
        res.status(200).json(result)
    }
) 