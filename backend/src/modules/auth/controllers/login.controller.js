import {NotFoundError,ForbiddenError} from "../../../core/constants/error/index.js"; 
import asyncHandler from "../../../core/utils/asyncHandler.js"
import { LoginService } from "../service/login.service.js"
import { setCookieAccess,setCookieRefresh } from "../../../core/utils/cookie.utils.js";
export const LoginController=asyncHandler(
    async(req,res)=>{
        const {user_name,password}=req.body;        
        const reuslt=await LoginService({user_name,passwordfe:password});
        switch (reuslt.code) {
            case 200:
                //set cooke
                setCookieAccess(res,reuslt.token.accessToken);
                setCookieRefresh(res,reuslt.token.refreshToken);
                return res.status(200).json(reuslt.data);
                
              
                case 403:
                    throw new ForbiddenError(reuslt.mes);
                case 404:  
                    throw new NotFoundError(reuslt.mes);
            
        }
        
    }
)