import express from "express";
const report_route = express.Router();

import reportController from "../controllers/reportController";
import verifyAccessToken from "../middlewares/jwtVerifyUser";

const ReportController = new reportController();

/*************************      User Side       *******************************/
// Get Requests

// Post Requests
report_route.post("/report-request", verifyAccessToken, ReportController.createReport); // To Create a Report
report_route.post("/get-my-reports", verifyAccessToken, ReportController.getMyReports); // To get a specific user's all reports

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests

// Post Requests

export default report_route;
