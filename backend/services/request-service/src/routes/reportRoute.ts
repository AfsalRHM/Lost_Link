import express from "express";
const report_route = express.Router();

import ReportController from "../controllers/reportController";
import ReportService from "../services/reportService";
import RequestService from "../services/requestService";

const requestService = new RequestService();
const reportService = new ReportService(requestService);
const reportController = new ReportController(reportService);

// Get Requests
report_route.get("/:id/reports", reportController.getMyReports); // To get a specific user's all reports

// Post Requests
report_route.post("/report-request", reportController.createReport); // To Create a Report

export default report_route;
