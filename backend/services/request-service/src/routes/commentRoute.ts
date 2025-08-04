import express from "express";
const comment_route = express.Router();

import CommentService from "../services/commentService";
import CommentController from "../controllers/commentController";

const commentService = new CommentService();
const commentController = new CommentController(commentService);

// Get Requests
comment_route.get("/:id/comments", commentController.getRequestComments); // To get all the comments of a specific request
comment_route.get("/admin/:id/comments", commentController.getRequestComments); // To get all the comments of a specific request

// Post Requests
comment_route.post("/comments", commentController.createComment); // To Create a Comment

export default comment_route;
