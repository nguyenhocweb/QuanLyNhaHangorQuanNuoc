// gọi api google để lấy token từ code

import axios from "axios";
import { googleConfig } from "../../config/loginAuth.config.js"; 
export const getGoogleTokens=async(code)=>{
    const values=new URLSearchParams({
        code:code,
        client_id:googleConfig.Client_id,
        client_secret:googleConfig.Client_secret,
        redirect_uri:googleConfig.Callback_url,
        grant_type:"authorization_code"
    });
    const res=await axios.post(googleConfig.tokenUrl,values.toString(),{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    });
    return res.data;//trả về access token và id token
}
// gọi api google để lấy thông tin user từ access token
export const getGoogleUser=async(access_token)=>{
    // Sử dụng access_token để lấy thông tin user từ Google
    const res=await axios.get(googleConfig.userInfoUrl,{
        headers:{
            Authorization:`Bearer ${access_token}`
        }
    });
    return res.data;//trả về thông tin user
}