import express from "express";
const user_route = express.Router();

import userController from "../controllers/userController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";
import updateUserDataValidator from "../validator/editUserDetailsValidator";

const UserController = new userController();

/*************************      User Side       *******************************/
// Get Requests
user_route.get("/get-profile", verifyAccessToken , UserController.getProfile); // To get the user data

// Patch Requests
user_route.patch("/update-user", verifyAccessToken, updateUserDataValidator, UserController.updateUser); // To update the user data


/*************************      Admin Side       *******************************/
// Get Requests
user_route.get("/allUsers", verifyAdminAccessToken , UserController.getAllUsers); // To get all users
user_route.get("/get-user-details/:id", verifyAdminAccessToken , UserController.getUserData); // To get the user details

export default user_route;
