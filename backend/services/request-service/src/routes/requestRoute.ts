import express from "express";
const request_route = express.Router();

import requestController from "../controllers/requestController";
import verifyAccessToken, {
  verifyAdminAccessToken,
} from "../middlewares/jwtVerifyUser";

const RequestController = new requestController();

/*************************      User Side       *******************************/
// Get Requests
request_route.get("/getAllRequests", verifyAccessToken, RequestController.getAllRequests); // To get all the requests to show in the request part

// Post Requests
request_route.post("/create_request", verifyAccessToken, RequestController.createRequest); // To create new Requests
request_route.post("/create_checkout_session", verifyAccessToken, RequestController.managePayment); // To manage the Payment
request_route.post("/getMyRequests", verifyAccessToken, RequestController.getUserRequests); // To get the user requests
request_route.post("/getRequestDetails", verifyAccessToken, RequestController.getRequestDetails); // To get the details of the request
request_route.post("/create-redeem-request", verifyAccessToken, RequestController.createRedeemRequest); // To save the request redeem details

// Patch Requests
request_route.patch("/cancelRequest", verifyAccessToken, RequestController.cancelRequest); // To cancel a request


/*************************      Admin Side       *******************************/
// Get Requests
request_route.get("/getAllRequestsAdmin", verifyAdminAccessToken, RequestController.getAllRequests); // To get all the requests in the admin side

// Post Requests
request_route.post("/changeRequestStatus", verifyAdminAccessToken, RequestController.changeRequestStatus); // To change the request status

export default request_route;
