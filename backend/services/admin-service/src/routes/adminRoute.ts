import express from "express";
const admin_route = express.Router();

import adminController from "../controllers/adminController";
import verifyAccessToken from "../middlewares/jwtVerifyAdmin";

const AdminController = new adminController();

// Get Reqeusts
admin_route.get("/allUsers", verifyAccessToken, AdminController.getAllUsers); // To Get All the Users
admin_route.get("/", verifyAccessToken, AdminController.getAllAdmins);

// Post Requests
admin_route.post("/", verifyAccessToken, AdminController.insertAdmin);
admin_route.post("/login-verify", AdminController.adminLogin);
admin_route.post("/refreshToken", AdminController.refreshToken);
admin_route.post("/logout", AdminController.adminLogout);

// Patch Requests
admin_route.patch("/user/:id", verifyAccessToken, AdminController.changeUserStatus);
admin_route.patch("/:id", verifyAccessToken, AdminController.changeAdminStatus);



export default admin_route;
