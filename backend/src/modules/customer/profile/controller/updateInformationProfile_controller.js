import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateInformationProfileService } from "../service/updateImformationProfile_service.js";
export const UpdateInformationProfileController=asyncHandler(
    async(req,res)=>{
        const data=req.body
        const result=await updateInformationProfileService(data);
         return res.json(result);
    }
)