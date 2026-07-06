import asyncHandler from "../utils/asyncHandler.js";
import { AuthFailureError } from "../constants/error/index.js";
import { verifyTokenAccess, verifyTokenRefresh } from "../utils/authUtils.js";

export const authenticateToken = asyncHandler(async(req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    
    let decoded = null;

    if (accessToken) {
        decoded = verifyTokenAccess(accessToken);
    }
    
    if (!decoded && refreshToken) {
        decoded = verifyTokenRefresh(refreshToken);
    }

    if (!decoded) {
        throw new AuthFailureError('Phiên bản đã hết hạn, vui lòng đăng nhập lại');
    }
    
    req.user = decoded;
    next();
});