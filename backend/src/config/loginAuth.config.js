import crypto from "crypto";
import "dotenv/config.js"
export const googleConfig={
    authUrl:"https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl:"https://oauth2.googleapis.com/token",
    userInfoUrl:"https://www.googleapis.com/oauth2/v3/userinfo",
     ggUrl:process.env.GOOGLE_URL,
    Client_id:process.env.GOOGLE_CLIENT_ID,
    Client_secret:process.env.GOOGLE_CLIENT_SECRET,
    Callback_url:process.env.GOOGLE_CALLBACK_URL,
    response_type:"code",
    scope:["openid","profile","email"],
    state:crypto.randomUUID(),// tạo chuỗi ngẫu nhiên để bảo vệ chống tấn công CSRF
    clientUrl:process.env.ClientUrl,
}
