import asyncHandler from "../../../../core/utils/asyncHandler.js";
import {LoginSuccessService} from "../service/loginSuccess.service.js";
import { verifyTokenAccess, createTokenAccess, createTokenRefresh } from "../../../../core/utils/authUtils.js";
import { setCookieAccess, setCookieRefresh } from "../../../../core/utils/cookie.utils.js";
import { NotFoundError, AuthFailureError } from "../../../../core/constants/error/index.js";

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
            case 200:
                // Re-issue tokens with fresh data
                const User = result.data;
                const tokenPayload = {
                    id: User.id,
                    role: User.role,
                    employmentType: User.brand ? "BRAND" : (User.restaurant ? "RESTAURANT" : null),
                    permissions: User.permissions ?? null
                };
                setCookieAccess(res, createTokenAccess(tokenPayload));
                setCookieRefresh(res, createTokenRefresh(tokenPayload));
                
                return res.status(200).json(User);
        }
    }
)