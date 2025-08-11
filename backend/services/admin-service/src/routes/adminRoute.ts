import express from "express";
const admin_route = express.Router();

import AdminController from "../controllers/adminController";
import AdminService from "../services/adminService";
import AdminRepository from "../repositories/adminRepository";
import adminModel from "../model/adminModel";

const adminRepository = new AdminRepository(adminModel);
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

// Get Reqeusts
admin_route.get("/allUsers", adminController.getAllUsers); // To get all users
admin_route.get("/", adminController.getAllAdmins); // To get all admins

// Post Requests
admin_route.post("/login-verify", adminController.adminLogin); // To verify login
admin_route.post("/refreshToken", adminController.refreshToken); // To refresh token
admin_route.post("/logout", adminController.adminLogout); // To logout
admin_route.post("/", adminController.insertAdmin); // To insert new admin

// Patch Requests
admin_route.patch("/user/:id", adminController.changeUserStatus); // To change user status
admin_route.patch("/:id", adminController.changeAdminStatus); // To change admin satus

export default admin_route;
