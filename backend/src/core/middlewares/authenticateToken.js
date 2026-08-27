import  ansyncHandler from "../utils/asyncHandler.js";
import {AuthFailureError} from "../constants/error/index.js";
import {createTokenAccess,createTokenRefresh,verifyTokenAccess} from "../utils/authUtils.js";
export const authenticateToken=ansyncHandler(async(req,res,next)=>{
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    
    // Nếu không có token ở Header, lấy từ Cookie (do API refresh chỉ set cookie)
    if (!token && req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    
    console.log("token: ", token ? "Found" : "undefined");
    
    if(!token){
        throw new AuthFailureError('Phiên bản đã hết hạn, vui lòng đăng nhập lại');
    }
    const verify = verifyTokenAccess(token);
    if(verify){
        console.log("token Asses",true);
        req.user = verify; // Gán req.user để authorizeRole có thể đọc được
        next();
    } else{
        console.log("token Asses",false);
        throw new AuthFailureError('Phiên bản đã hết hạn, vui lòng đăng nhập lại');
    }
});