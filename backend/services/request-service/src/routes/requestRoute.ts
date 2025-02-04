import express from "express";
const request_route = express.Router();

import requestController from "../controllers/requestController";
import verifyAccessToken, {
  verifyAdminAccessToken,
} from "../middlewares/jwtVerifyUser";

const RequestController = new requestController();

request_route.get(
  "/getAllRequests",
  verifyAccessToken,
  RequestController.getAllRequests
);

request_route.post(
  "/create_request",
  verifyAccessToken,
  RequestController.createRequest
);
request_route.post(
  "/create_checkout_session",
  verifyAccessToken,
  RequestController.managePayment
);
request_route.post(
  "/getMyRequests",
  verifyAccessToken,
  RequestController.getUserRequests
);
request_route.post(
  "/getRequestDetails",
  verifyAccessToken,
  RequestController.getRequestDetails
);

request_route.get(
  "/getAllRequestsAdmin",
  verifyAdminAccessToken,
  RequestController.getAllRequests
);

request_route.post(
  "/changeRequestStatus",
  verifyAdminAccessToken,
  RequestController.changeRequestStatus
);

export default request_route;
