import asyncHandler from "../../../core/utils/asyncHandler.js";
import { setCookieRefresh,setCookieAccess } from "../../../core/utils/cookie.utils.js";
import {verifyTokenRefresh,createTokenAccess,createTokenRefresh} from "../../../core/utils/authUtils.js";
import { AuthFailureError } from "../../../core/constants/error/index.js";
export const testRefresh=asyncHandler(
    async(req,res)=>{
        // Lấy token từ cookie thay vì Header Authorization
       const refreshToken = req.cookies.refreshToken; 
       console.log("textRefresh:",refreshToken);
       
       if(refreshToken) {
          const verify=verifyTokenRefresh(refreshToken);
          if(verify){ 
            const access=createTokenAccess(verify);
            const refresh=createTokenRefresh(verify);
            setCookieAccess(res,access)
            setCookieRefresh(res,refresh);
            res.status(204).json();
          }
         throw new AuthFailureError("phiên bản đăng nhập đã hết hạn")
       }
     throw new AuthFailureError("phiên bản đăng nhập đã hết hạn")
    }
)