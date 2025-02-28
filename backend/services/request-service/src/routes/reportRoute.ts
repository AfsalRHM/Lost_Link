import express from "express";
const report_route = express.Router();

import reportController from "../controllers/reportController";
import verifyAccessToken from "../middlewares/jwtVerifyUser";

const ReportController = new reportController();

/*************************      User Side       *******************************/
// Get Requests

// Post Requests
report_route.post("/report-request", verifyAccessToken, ReportController.createReport); // To Create a Report
report_route.post("/get-request-comments", verifyAccessToken, ReportController.getRequestReports); // To get all the reports of a specific request

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests

// Post Requests

export default report_route;
