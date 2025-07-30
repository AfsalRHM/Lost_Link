import express from "express";
const comment_route = express.Router();

import commentController from "../controllers/commentController";
import verifyAccessToken from "../middlewares/jwtVerifyUser";

const CommentController = new commentController();

/*************************      User Side       *******************************/
// Get Requests
comment_route.get("/:id/comments", verifyAccessToken, CommentController.getRequestComments); // To get all the comments of a specific request

// Post Requests
comment_route.post("/comments", verifyAccessToken, CommentController.createComment); // To Create a Comment

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests

// Post Requests

export default comment_route;
