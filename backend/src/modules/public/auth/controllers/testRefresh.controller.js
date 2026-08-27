import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { setCookieRefresh,setCookieAccess } from "../../../../core/utils/cookie.utils.js";
import {verifyTokenRefresh,createTokenAccess,createTokenRefresh} from "../../../../core/utils/authUtils.js";
import { AuthFailureError } from "../../../../core/constants/error/index.js";
import { getUser } from "../repositories/User.db.js";

export const testRefresh=asyncHandler(
    async(req,res)=>{
        // Lấy token từ cookie thay vì Header Authorization
       const refreshToken = req.cookies.refreshToken; 
       console.log("textRefresh:",refreshToken);
       
       if(refreshToken) {
          let verify=verifyTokenRefresh(refreshToken);
          console.log("verify",verify);
          if(verify){ 
            // Lấy lại dữ liệu mới nhất từ DB để đảm bảo payload không bị out-date (ví dụ đổi role thành systemRole)
            const user = await getUser({ id: verify.id });
            if (!user) throw new AuthFailureError("Tài khoản không tồn tại hoặc đã bị xóa");
            
            const payload = {
                id: user.id,
                systemRole: user.systemRole,
                brand: user.brand,
                restaurant: user.restaurant,
                permissions: user.permissions ?? null
            };

            const access=createTokenAccess(payload);
            const refresh=createTokenRefresh(payload);
            setCookieAccess(res,access)
            setCookieRefresh(res,refresh);
            return res.status(204).json();
          }
         throw new AuthFailureError("phiên bản đăng nhập đã hết hạn")
       }
     throw new AuthFailureError("phiên bản đăng nhập đã hết hạn")
    }
)