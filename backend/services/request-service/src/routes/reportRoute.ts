import express from "express";
const report_route = express.Router();

import RequestService from "../services/requestService";
import RequestRepository from "../repositories/requestRepository";
import requestModel from "../models/requestModel";
import ReportRepository from "../repositories/reportRepository";
import reportModel from "../models/reportModel";

import ReportController from "../controllers/reportController";
import ReportService from "../services/reportService";
import RedeemRequestRepository from "../repositories/redeemRequestRepository";
import redeemRequestModel from "../models/redeemRequestModel";

const redeemRequestRepository = new RedeemRequestRepository(redeemRequestModel);
const reportRepository = new ReportRepository(reportModel);

const requestRepository = new RequestRepository(requestModel);
const requestService = new RequestService(
  requestRepository,
  redeemRequestRepository,
  reportRepository
);

const reportService = new ReportService(reportRepository, requestService);
const reportController = new ReportController(reportService);

// Get Requests
report_route.get("/:id/reports", reportController.getMyReports); // To get a specific user's all reports

// Post Requests
report_route.post("/report-request", reportController.createReport); // To Create a Report

export default report_route;
