import  ansyncHandler from "../utils/asyncHandler.js";
import {AuthFailureError} from "../constants/error/index.js";
import {createTokenAccess,createTokenRefresh,verifyTokenAccess} from "../utils/authUtils.js";
export const authenticateToken=ansyncHandler(async(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    console.log("token: ",token);
    
    if(!token){
        throw new AuthFailureError('Phiên bản đã hết hạn, vui lòng đăng nhập lại');
    }
    if(verifyTokenAccess(token)){
        console.log("token Asses",true);
        next();
    } else{
        console.log("token Asses",false);
        throw new AuthFailureError('Phiên bản đã hết hạn, vui lòng đăng nhập lại');
    }
});