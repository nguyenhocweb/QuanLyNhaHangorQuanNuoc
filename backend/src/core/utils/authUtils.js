import { Token } from "../../config/app.config.js"
import jwt from "jsonwebtoken";
export const createTokenAccess=(payload,expiresIn)=>{
  return  jwt.sign(payload,Token.ACCESS.SECRET,{
    expiresIn:expiresIn || Token.ACCESS.EXPIRES
  })
}
export const createTokenRefresh=(payload,expiresIn)=>{
  return jwt.sign(payload,Token.REFRESH.SECRET,{
    expiresIn:expiresIn ||Token.REFRESH.EXPIRES
  })
};
export const verifyTokenAccess=(token)=>{
    try {
        return jwt.verify(token,Token.ACCESS.SECRET);
        
    } catch (error) {
        return false;
    }
}
export const verifyTokenRefresh=(token)=>{
    try {
         return jwt.verify(token,Token.REFRESH.SECRET);
       
    } catch (error) {
        return false;
    }
}
