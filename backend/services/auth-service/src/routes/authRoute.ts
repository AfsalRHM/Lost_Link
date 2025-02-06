import express from "express";
const auth_route = express.Router();

import authController from "../controllers/authController";
import loginValidator from "../validator/loginValidator";
import signinValidator from "../validator/signinValidator";
import sendmailValidator from "../validator/sendmailValidator";
import verifyotpValidator from "../validator/verifyotpValidator";
import isUserLogin from "../utils/isUserLogin";

const AuthController = new authController();
/*************************      User Side       *******************************/
// Post Requests
auth_route.post("/sendMail", sendmailValidator, AuthController.sendMail);
auth_route.post("/verifyOTP", verifyotpValidator, AuthController.verifyOTP);
auth_route.post("/insertUser", signinValidator, AuthController.insertUser);
auth_route.post("/loginVerify", loginValidator, AuthController.loginVerify);
auth_route.post("/googleLogin", AuthController.googleLoginVerify);
auth_route.post("/sendResetPasswordOTP", AuthController.sendResetPasswordMail); // Password Routes - For sending mail to the user
auth_route.post("/resetPassword", AuthController.resetPassword); // Password Routes - For updating the password on the user side
auth_route.post("/refreshToken", AuthController.refreshToken); // New Refresh Token Route
auth_route.post("/isUserLogin", isUserLogin); // User Login Verify Route
auth_route.post("/logout", AuthController.userLogout); // User Logout

export default auth_route;
