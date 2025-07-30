import express from "express";
const meet_route = express.Router();

import meetController from "../controllers/meetController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";

const MeetController = new meetController();

/*************************      User Side       *******************************/
// Get Requests
meet_route.get("/:id/meetings", verifyAccessToken, MeetController.getUserMeets); // To get list of meeting of a particular user

// Post Requests
meet_route.post("/", verifyAccessToken, MeetController.createMeet); // To get schedule a meet

// meet_route.post("/fetch-user-meetings", verifyAccessToken, MeetController.getUserMeets); // To get list of meeting of a particular user

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests
meet_route.get("/admin/meet/all", verifyAdminAccessToken, MeetController.getAllMeets); // To get all the meets
meet_route.get("/admin/meet/:id", verifyAdminAccessToken, MeetController.getMeetDataAdmin); // To get details of one meet

// Post Requests

export default meet_route;
