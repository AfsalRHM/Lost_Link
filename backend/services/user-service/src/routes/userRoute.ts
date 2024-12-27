import express from "express";
const user_route = express.Router();

import userController from "../controllers/userController";
import verifyAccessToken from "../middlewares/jwtVerifyUser";

const UserController = new userController();

user_route.get("/getProfile", verifyAccessToken , UserController.getProfile);

export default user_route;
