import express from "express";
const request_route = express.Router();

import requestController from "../controllers/requestController";
// import verifyAccessToken from "../middlewares/jwtVerifyUser";

const RequestController = new requestController();

// user_route.get("/getProfile", verifyAccessToken , UserController.getProfile);

export default request_route;
