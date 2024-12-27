import express from "express";
const auth_route = express.Router();

import authController from "../controllers/authController";
import loginValidator from "../validator/loginValidator";
import signinValidator from "../validator/signinValidator";
import sendmailValidator from "../validator/sendmailValidator";
import verifyotpValidator from "../validator/verifyotpValidator";
import isUserLogin from "../utils/isUserLogin";

const AuthController = new authController();

auth_route.post("/sendMail", sendmailValidator, AuthController.sendMail);
auth_route.post("/verifyOTP", verifyotpValidator, AuthController.verifyOTP);
auth_route.post("/insertUser", signinValidator, AuthController.insertUser);
auth_route.post("/loginVerify", loginValidator, AuthController.loginVerify);

auth_route.post("/refreshToken", AuthController.refreshToken);

auth_route.post("/isUserLogin", isUserLogin);

export default auth_route;