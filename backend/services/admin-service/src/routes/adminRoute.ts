import express from "express";
const admin_route = express.Router();

import adminController from "../controllers/adminController";

const AdminController = new adminController();

admin_route.post("/adminLogin", AdminController.adminLogin);
admin_route.post("/allUsers", AdminController.getAllUsers);
admin_route.post("/changeUserStatus", AdminController.changeUserStatus);
admin_route.post("/allAdmins", AdminController.getAllAdmins);
admin_route.post("/addAdmin", AdminController.insertAdmin);

export default admin_route;
