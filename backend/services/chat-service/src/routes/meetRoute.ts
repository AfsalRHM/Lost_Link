import express from "express";
const meet_route = express.Router();

import MeetController from "../controllers/meetController";
import MeetService from "../services/meetService";
import MeetRepository from "../repositories/meetRepository";
import meetModel from "../model/meetModel";

const meetRepository = new MeetRepository(meetModel);
const meetService = new MeetService(meetRepository);
const meetController = new MeetController(meetService);

/*************************      User Side       *******************************/
// Get Requests
meet_route.get("/:id/meetings", meetController.getUserMeets); // To get list of meeting of a particular user

// Post Requests
meet_route.post("/", meetController.createMeet); // To get schedule a meet

/*************************      Admin Side       *******************************/
// Get Requests
meet_route.get("/admin/meet/all", meetController.getMeets); // To get all the meets
meet_route.get("/admin/meet/:id", meetController.getMeetDataAdmin); // To get details of one meet

export default meet_route;
