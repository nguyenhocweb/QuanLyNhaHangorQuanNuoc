import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { ChangePasswordService } from "../service/changePassword_service.js";
export const ChangePasswordController=asyncHandler(
    async(req,res)=>{
        const {id,currentPassword,newPassword}=req.body;
        const result=await ChangePasswordService({id,currentPassword,newPassword});
        return res.json(result)
    }
)