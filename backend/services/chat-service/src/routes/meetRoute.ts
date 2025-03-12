import express from "express";
const meet_route = express.Router();

import meetController from "../controllers/meetController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";

const MeetController = new meetController();

/*************************      User Side       *******************************/
// Get Requests

// Post Requests
meet_route.post("/create-meeting", verifyAccessToken, MeetController.createMeet); // To get schedule a meet

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests
meet_route.get("/fetch-all-meets", verifyAdminAccessToken, MeetController.getAllMeets); // To get all the meets

// Post Requests
meet_route.post("/fetch-admin-meet-data", verifyAdminAccessToken, MeetController.getMeetDataAdmin); // To get details of one meet

export default meet_route;
