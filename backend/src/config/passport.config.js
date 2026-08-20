import passport from "passport";
import "dotenv/config.js"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import {verifyOAuthUserService} from "../modules/auth/service/verifyOAuthUser.service.js"

// HÀM XỬ LÝ CHUNG: Ánh xạ dữ liệu thô từ các mạng xã hội về 1 chuẩn duy nhất
const handleOAuth = async (accessToken,refreshToken,profile, done) => {
    try {
     
        
        // Trích xuất dữ liệu tùy theo cấu trúc của từng provider
        const profileData = {
            provider: profile.provider, // 'google', 'facebook', 'github'
            providerId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || null,
            avatar: profile.photos?.[0]?.value || null,
        }; 
        // Gọi service xử lý DB
        const user = await verifyOAuthUserService(profileData);
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
};

// 1. CẤU HÌNH GOOGLE
passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, handleOAuth) // Truyền hàm chung vào đây
);

// // 2. CẤU HÌNH FACEBOOK
// passport.use(
//     new FacebookStrategy({
//         clientID: process.env.FACEBOOK_APP_ID,
//         clientSecret: process.env.FACEBOOK_APP_SECRET,
//         callbackURL: "/api/auth/facebook/callback",
//         profileFields: ['id', 'displayName', 'photos', 'email'], // FB yêu cầu khai báo rõ trường cần lấy
//     }, handleOAuth) // Vẫn dùng chung hàm
// );

// // 3. CẤU HÌNH GITHUB
// passport.use(
//     new GitHubStrategy({
//         clientID: process.env.GITHUB_CLIENT_ID,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET,
//         callbackURL: "/api/auth/github/callback",
//         scope: ['user:email'], // Bắt buộc để lấy được email từ Github
//     }, handleOAuth) // Vẫn dùng chung hàm
// );

export { passport};