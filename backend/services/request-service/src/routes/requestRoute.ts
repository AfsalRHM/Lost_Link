import express from "express";
const request_route = express.Router();

import requestController from "../controllers/requestController";
import verifyAccessToken, {
  verifyAdminAccessToken,
} from "../middlewares/jwtVerifyUser";

const RequestController = new requestController();

/*************************      User Side       *******************************/
// Get Requests
request_route.get("/get-all-requests", verifyAccessToken, RequestController.getAllRequests); // To get all the requests to show in the request part
request_route.get("/:id/requests", verifyAccessToken, RequestController.getUserRequests); // To get the user requests
request_route.get("/:id/redeem-request", verifyAccessToken, RequestController.getRedeemRequestDetails); // To get the details of a specific redeem request
request_route.get("/redeem-request/my", verifyAccessToken, RequestController.getUserRedeemRequests); // To get all the redeem requests to show in the profile

// Post Requests
request_route.post("/create-checkout-session", verifyAccessToken, RequestController.managePayment); // To manage the Payment
request_route.post("/create-request", verifyAccessToken, RequestController.createRequest); // To create new Requests
request_route.post("/get-request-details", verifyAccessToken, RequestController.getRequestDetails); // To get the details of the request
request_route.post("/create-redeem-request", verifyAccessToken, RequestController.createRedeemRequest); // To save the request redeem details
request_route.post("/getUserRedeemRequests", verifyAccessToken, RequestController.getUserRedeemRequests); // To get all the redeem requests to show in the profile

// Patch Requests
request_route.patch("/:id", verifyAccessToken, RequestController.cancelRequest); // To cancel a request
request_route.patch("/:id/like", verifyAccessToken, RequestController.changeLikeStatus); // To change the like status of the request


/*************************      Admin Side       *******************************/
// Get Requests
request_route.get("/admin/all", verifyAdminAccessToken, RequestController.getAllRequests); // To get all the requests in the admin side
request_route.get("/admin/:id", verifyAdminAccessToken, RequestController.adminGetRequestDetails); // To get all the redeem requests in the admin side
request_route.get("/admin/redeem-request/all", verifyAdminAccessToken, RequestController.getAllRedeemRequests); // To get all the redeem requests in the admin side
request_route.get("/admin/redeem-request/:id", verifyAdminAccessToken, RequestController.getRedeemRequestDetails); // To get the redeem requests details in the admin side

// Post Requests
request_route.post("/admin/update-redeem-request", verifyAdminAccessToken, RequestController.changeRedeemRequestStatus); // To change the redeem request status

// Patch Requests
request_route.patch("/admin/:id", verifyAdminAccessToken, RequestController.changeRequestStatus); // To change the request status
request_route.patch("/admin/:id/cancel", verifyAdminAccessToken, RequestController.cancelRequest); // To cancel a request

export default request_route;
