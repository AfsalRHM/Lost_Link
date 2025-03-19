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
auth_route.post("/send-mail", sendmailValidator, AuthController.sendMail);
auth_route.post("/verify-otp", verifyotpValidator, AuthController.verifyOTP);
auth_route.post("/insert-user", signinValidator, AuthController.insertUser);
auth_route.post("/login-verify", loginValidator, AuthController.loginVerify);
auth_route.post("/google-login", AuthController.googleLoginVerify);
auth_route.post("/send-reset-password-otp", AuthController.sendResetPasswordMail); // Password Routes - For sending mail to the user
auth_route.post("/reset-password", AuthController.resetPassword); // Password Routes - For updating the password on the user side
auth_route.post("/refreshToken", AuthController.refreshToken); // Route to check the Refresh Token and Create New Access Token
auth_route.post("/isUserLogin", isUserLogin); // User Login Verify Route
auth_route.post("/logout", AuthController.userLogout); // User Logout

export default auth_route;
