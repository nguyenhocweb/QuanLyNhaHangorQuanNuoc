import "dotenv/config.js"
import crypto from "crypto";
export const appConfig={
      port:process.env.PORT,
      node:process.env.NODE_ENV,
      url_client:process.env.URL_CLIENT,
}
export const Token={
      ACCESS:{
            EXPIRES:process.env.ACCESS_TOKEN_EXPIRES_IN,
            SECRET:process.env.ACCESS_TOKEN_SECRET
      },
      REFRESH:{
            EXPIRES:process.env.REFRESH_TOKEN_EXPIRES_IN,
            SECRET:process.env.REFRESH_TOKEN_SECRET
      },
}
