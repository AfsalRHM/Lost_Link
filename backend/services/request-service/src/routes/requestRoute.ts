import express from "express";
const request_route = express.Router();

import RequestRepository from "../repositories/requestRepository";
import requestModel from "../models/requestModel";
import ReportRepository from "../repositories/reportRepository";
import reportModel from "../models/reportModel";
import RedeemRequestRepository from "../repositories/redeemRequestRepository";
import redeemRequestModel from "../models/redeemRequestModel";

import RequestController from "../controllers/requestController";
import RequestService from "../services/requestService";

const reportRepository = new ReportRepository(reportModel);
const redeemRequestRepository = new RedeemRequestRepository(redeemRequestModel);

const requestRepository = new RequestRepository(requestModel);
const requestService = new RequestService(requestRepository,redeemRequestRepository, reportRepository);
const requestController = new RequestController(requestService);

/*************************      User Side       *******************************/
// Get Requests
request_route.get("/get-all-requests", requestController.getAllRequests); // To get all the requests to show in the request part
request_route.get("/:id/requests", requestController.getUserRequests); // To get the user requests
request_route.get("/:id/redeem-request", requestController.getRedeemRequestDetails); // To get the details of a specific redeem request
request_route.get("/redeem-request/my", requestController.getUserRedeemRequests); // To get all the redeem requests to show in the profile
request_route.get("/:id/request/my", requestController.getMyRequestDetails); // To get the details of the request

// Post Requests
request_route.post("/create-checkout-session", requestController.managePayment); // To manage the Payment
request_route.post("/create-request", requestController.createRequest); // To create new Requests
request_route.post("/get-request-details", requestController.getRequestDetails); // To get the details of the request
request_route.post("/create-redeem-request", requestController.createRedeemRequest); // To save the request redeem details

// Patch Requests
request_route.patch("/:id", requestController.cancelRequest); // To cancel a request
request_route.patch("/:id/like", requestController.changeLikeStatus); // To change the like status of the request

/*************************      Admin Side       *******************************/
// Get Requests
request_route.get("/admin/all", requestController.adminGetAllRequests); // To get all the requests in the admin side
request_route.get("/admin/:id", requestController.adminGetRequestDetails); // To get all the redeem requests in the admin side
request_route.get("/admin/redeem-request/all", requestController.getAllRedeemRequests); // To get all the redeem requests in the admin side
request_route.get("/admin/redeem-request/:id", requestController.getRedeemRequestDetails); // To get the redeem requests details in the admin side

// Post Requests
request_route.post("/admin/update-redeem-request", requestController.changeRedeemRequestStatus); // To change the redeem request status

// Patch Requests
request_route.patch("/admin/:id", requestController.changeRequestStatus); // To change the request status
request_route.patch("/admin/:id/cancel", requestController.cancelRequest); // To cancel a request

export default request_route;
