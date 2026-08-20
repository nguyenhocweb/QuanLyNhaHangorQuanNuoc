import asyncHandler from "../../../core/utils/asyncHandler.js";
import { passport } from "../../../config/passport.config.js";
import "dotenv/config.js";
import {setCookieAccess,setCookieRefresh} from "../../../core/utils/cookie.utils.js"
export const OAuth=asyncHandler(
    async(req,res,next)=>{
        const { type } = req.params;
        const scope = type === 'github' ? ['user:email'] : ['profile', 'email'];
        passport.authenticate(type, { scope: scope, session: false })(req, res, next);
    }
);
export const OAuthCallback = (req, res, next) => {
  const { type } = req.params;

  passport.authenticate(type, { session: false }, (err, user, info) => {
    if (err) {
      console.error("❌ OAuth Strategy Error:", err);
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    if (!user) {    
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }  
    setCookieAccess(res,user.token.accessToken);
    setCookieRefresh(res,user.token.refreshToken)
    const redirectUrl = `${process.env.FRONTEND_URL}/loginSuccess`;
    return res.redirect(redirectUrl);
  })(req, res, next);
};