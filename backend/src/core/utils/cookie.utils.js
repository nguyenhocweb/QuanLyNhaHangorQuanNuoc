import "dotenv/config.js"

export const setCookieRefresh = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,  // JS không được phép đọc (Chống XSS)
        secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS
        sameSite: 'strict', // Chống CSRF
        path: '/api/v1/auth/refresh/', // Gửi cookie chỉ cho đg dẫn này dùng 
        maxAge: 3 * 24 * 60 * 60 * 1000 // 7 ngày
    })
}
export const setCookieAccess = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,  // JS không được phép đọc (Chống XSS)
        secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS
        sameSite: 'strict', // Chống CSRF
        path: '/api/v1/', // Gửi cookie cho tất cả các đường dẫn
        maxAge: 15 * 60 * 1000 // 15 phút
    })
}
export const clearCookieRefresh = (res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
}
export const clearCookieAccess = (res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
}