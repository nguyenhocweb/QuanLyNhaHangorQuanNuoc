import {Router} from "express"

const router=Router();
import {LoginController} from "./controllers/login.controller.js";
import {OAuth,OAuthCallback} from "./controllers/Oauth.controler.js";
import {testRefresh} from "./controllers/testRefresh.controller.js";
import {LoginSuccess} from "./controllers/loginSuccess.controller.js";
import { validate } from "../../core/middlewares/validator.middleware.js";
import LoginValidator from "./validators/Login.validator.js";

router.post("/login",validate(LoginValidator),LoginController)
router.get("/OAuth/:type",OAuth);
router.post("/refresh/test",testRefresh);
router.get("/refresh/logout",OAuth);
router.get("/loginSuccess",LoginSuccess);
router.get("/OAuth/:type/callback",OAuthCallback);

export default  router