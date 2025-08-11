import express from "express";
const user_route = express.Router();

import updateUserDataValidator from "../validator/editUserDetailsValidator";

import UserRepository from "../repositories/userRepository";
import userModel from "../models/userModel";
import UserService from "../services/userService";
import UserController from "../controllers/userController";

const userRepository = new UserRepository(userModel);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/*************************      User Side       *******************************/
// Get Requests
user_route.get("/get-profile", userController.getProfile); // To get the user data

// Patch Requests
user_route.patch("/", updateUserDataValidator, userController.updateUser); // To update the user data

/*************************      Admin Side       *******************************/
// Get Requests
user_route.get("/admin/all", userController.getAllUsers); // To get all users
user_route.get("/admin/:id", userController.getUserData); // To get the user details

export default user_route;
