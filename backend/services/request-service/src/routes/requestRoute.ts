import express from "express";
const request_route = express.Router();

import requestController from "../controllers/requestController";
import verifyAccessToken from "../middlewares/jwtVerifyUser";

const RequestController = new requestController();

request_route.post(
  "/create_request",
  verifyAccessToken,
  RequestController.createRequest
);

export default request_route;
