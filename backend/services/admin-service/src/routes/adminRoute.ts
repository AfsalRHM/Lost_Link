import express from "express";
const admin_route = express.Router();

import adminController from "../controllers/adminController";

const AdminController = new adminController();

admin_route.post("/adminLogin", AdminController.adminLogin);

export default admin_route;
