import express from "express";
const admin_route = express.Router();

import adminController from "../controllers/adminController";
import verifyAccessToken from "../middlewares/jwtVerifyAdmin";

const AdminController = new adminController();

// Get Reqeusts
admin_route.get("/allUsers", verifyAccessToken, AdminController.getAllUsers); // To Get All the Users

admin_route.post("/adminLogin", AdminController.adminLogin);
admin_route.post("/changeUserStatus", verifyAccessToken, AdminController.changeUserStatus);
admin_route.post("/changeAdminStatus", verifyAccessToken, AdminController.changeAdminStatus);
admin_route.post("/allAdmins", verifyAccessToken, AdminController.getAllAdmins);
admin_route.post("/addAdmin", verifyAccessToken, AdminController.insertAdmin);

admin_route.post("/refreshToken", AdminController.refreshToken);

admin_route.post("/logout", AdminController.adminLogout);

export default admin_route;
