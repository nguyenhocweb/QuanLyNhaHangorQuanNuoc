import asyncHandler from "../../../core/utils/asyncHandler.js";
import {LoginSuccessService} from "../service/loginSuccess.service.js";
import {verifyTokenAccess} from "../../../core/utils/authUtils.js";
import {NotFoundError,AuthFailureError} from "../../../core/constants/error/index.js"; 
export const LoginSuccess=asyncHandler(
    async(req,res)=>{ 
        // lấy token access
        
        const TokenAccess=req.cookies.accessToken;
        if(!TokenAccess) throw new AuthFailureError("phiên bản đăng nhập đã hết hạn");
        const verifyAccess=verifyTokenAccess(TokenAccess);
        if (!verifyAccess) throw new AuthFailureError("phiên bản đăng nhập đã hết hạn");
        const result=await LoginSuccessService(verifyAccess.id);
        switch (result.code) {
            case 404: throw new NotFoundError(result.mes);
            case 200:res.status(200).json(result.data);
        }
    }
)