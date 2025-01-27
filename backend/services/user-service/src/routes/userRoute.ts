import express from "express";
const user_route = express.Router();

import userController from "../controllers/userController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";

const UserController = new userController();

/*************************      User Side       *******************************/
user_route.get("/getProfile", verifyAccessToken , UserController.getProfile); // To get the user data

/*************************      Admin Side       *******************************/
user_route.get("/allUsers", verifyAdminAccessToken , UserController.getAllUsers); // To get all users

export default user_route;
