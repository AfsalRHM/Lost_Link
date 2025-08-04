import express from "express";
const meet_route = express.Router();

import MeetController from "../controllers/meetController";
import MeetService from "../services/meetService";

const meetService = new MeetService();
const meetController = new MeetController(meetService);

/*************************      User Side       *******************************/
// Get Requests
meet_route.get("/:id/meetings", meetController.getUserMeets); // To get list of meeting of a particular user

// Post Requests
meet_route.post("/", meetController.createMeet); // To get schedule a meet

/*************************      Admin Side       *******************************/
// Get Requests
meet_route.get("/admin/meet/all", meetController.getAllMeets); // To get all the meets
meet_route.get("/admin/meet/:id", meetController.getMeetDataAdmin); // To get details of one meet

export default meet_route;
