import express from "express";
const user_route = express.Router();

import userController from "../controllers/userController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";

const UserController = new userController();

/*************************      User Side       *******************************/
// Get Requests
user_route.get("/getProfile", verifyAccessToken , UserController.getProfile); // To get the user data

// Patch Requests
user_route.patch("/update_user", verifyAccessToken, UserController.updateUser); // To update the user data


/*************************      Admin Side       *******************************/
user_route.get("/allUsers", verifyAdminAccessToken , UserController.getAllUsers); // To get all users

export default user_route;
