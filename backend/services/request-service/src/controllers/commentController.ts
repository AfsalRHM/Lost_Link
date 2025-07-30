import { Request, Response } from "express";

import commentService from "../services/commentService";
import IcommentController from "../interface/IcommentController";
import { StatusCode } from "../constants/statusCodes";

export default class CommentController implements IcommentController {
  private _commentService: commentService;

  constructor() {
    this._commentService = new commentService();
  }

  // To insert comments
  public createComment = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body.requestId || !req.body.commentText || !req.body.userId) {
        res.status(StatusCode.BAD_REQUEST).json({
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
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
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
      const requestId = req.params.id;
      const commentCount = req.query.count
        ? parseInt(req.query.count as string, 10)
        : 3;

      if (!requestId) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          message: "Request Id not found on the Params",
        });
        return;
      }

      const response = await this._commentService.getRequestComments({
        requestId,
        commentCount,
      });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        if (response.message == "Invalid Request ID format") {
          res.status(StatusCode.NOT_FOUND).json(response);
        } else {
          res.status(StatusCode.BAD_REQUEST).json(response);
        }
      }
    } catch (error) {
      console.log("error in getRequestComments/commentController", error);
    }
  };
}
