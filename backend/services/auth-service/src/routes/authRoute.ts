import express from "express";
const auth_route = express.Router();

import AuthController from "../controllers/authController";
import AuthService from "../services/authService";

import isUserLogin from "../utils/isUserLogin";

import loginValidator from "../validator/loginValidator";
import signinValidator from "../validator/signinValidator";
import sendmailValidator from "../validator/sendmailValidator";
import verifyotpValidator from "../validator/verifyotpValidator";

const authService = new AuthService();
const authController = new AuthController(authService);

/*************************      User Side       *******************************/
// Post Requests
auth_route.post("/send-mail", sendmailValidator, authController.sendMail); // For sending mail to the user
auth_route.post("/verify-otp", verifyotpValidator, authController.verifyOTP); // For verify otp
auth_route.post("/insert-user", signinValidator, authController.insertUser); // For insert user
auth_route.post("/login-verify", loginValidator, authController.loginVerify); // For verify login
auth_route.post("/google-login", authController.googleLoginVerify); // For google login
auth_route.post("/send-reset-password-otp", authController.sendResetPasswordMail); // For sending reset password mail to the user
auth_route.post("/reset-password", authController.resetPassword); // For updating the password on the user side
auth_route.post("/refreshToken", authController.refreshToken); // To verify Refresh Token and Create New Access Token
auth_route.post("/isUserLogin", isUserLogin); // User Login Verify
auth_route.post("/logout", authController.userLogout); // User Logout

export default auth_route;
