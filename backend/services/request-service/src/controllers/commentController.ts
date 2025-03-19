import { Request, Response } from "express";

import commentService from "../services/commentService";
import IcommentController from "../interface/IcommentController";

export default class CommentController implements IcommentController {
  private _commentService: commentService;

  constructor() {
    this._commentService = new commentService();
  }

  // To insert comments
  public createComment = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body.requestId || !req.body.commentText || !req.body.userId) {
        res.status(400).json({
          status: false,
          message: "No Data found on the createComment Post Request",
        });
        return;
      }

      const response = await this._commentService.createComment({
        requestId: req.body.requestId,
        commentText: req.body.commentText,
        userId: req.body.userId,
      });

      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      console.log("error in createComment/commentController", error);
    }
  };

  // To get comments of a request
  public getRequestComments = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.body.requestId) {
        res.status(400).json({
          status: false,
          message: "No Data found on the createComment Post Request",
        });
        return;
      }

      const response = await this._commentService.getRequestComments({
        requestId: req.body.requestId,
        commentCount: req.body.count,
      });

      if (response.status) {
        res.status(200).json(response);
      } else {
        if (response.message == "Invalid Request ID format") {
          res.status(404).json(response);
        } else {
          res.status(400).json(response);
        }
      }
    } catch (error) {
      console.log("error in getRequestComments/commentController", error);
    }
  };
}
