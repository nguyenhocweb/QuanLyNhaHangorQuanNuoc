import "dotenv/config.js";

export const setCookieRefresh = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,  // JS không được phép đọc (Chống XSS)
        secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS
        sameSite: 'lax', // Cho phép gửi cookie giữa FE (port 3000 / IP LAN) và BE (port 4000)
        path: '/api/v1/auth/refresh', // Chỉ router thuộc nhóm /api/v1/auth/refresh/* mới được phép truy cập
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 ngày
    });
};

export const setCookieAccess = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,  // JS không được phép đọc (Chống XSS)
        secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS
        sameSite: 'lax', // Cho phép gửi cookie giữa FE (port 3000 / IP LAN) và BE (port 4000)
        path: '/api/v1', // Gửi cookie cho tất cả các đường dẫn nghiệp vụ thuộc /api/v1/*
        maxAge: 15 * 60 * 1000 // 15 phút
    });
};

export const clearCookieRefresh = (res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth/refresh',
    });
};

export const clearCookieAccess = (res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1',
    });
};