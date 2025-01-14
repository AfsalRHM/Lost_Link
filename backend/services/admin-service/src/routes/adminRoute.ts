import express from "express";
const admin_route = express.Router();

import adminController from "../controllers/adminController";
import verifyAccessToken from "../middlewares/jwtVerifyUser";

const AdminController = new adminController();

admin_route.post("/adminLogin", AdminController.adminLogin);
admin_route.post("/allUsers", verifyAccessToken, AdminController.getAllUsers);
admin_route.post("/changeUserStatus", verifyAccessToken, AdminController.changeUserStatus);
admin_route.post("/allAdmins", verifyAccessToken, AdminController.getAllAdmins);
admin_route.post("/addAdmin", verifyAccessToken, AdminController.insertAdmin);

admin_route.post("/refreshToken", AdminController.refreshToken);

admin_route.post("/logout", AdminController.adminLogout);

export default admin_route;
