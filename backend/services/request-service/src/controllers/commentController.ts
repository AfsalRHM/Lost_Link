import { NextFunction, Request, Response } from "express";

import IcommentController from "../interface/IcommentController";
import IcommentService from "../interface/IcommentService";

import { StatusCode } from "../constants/statusCodes";
import { AppError } from "../utils/appError";

export default class CommentController implements IcommentController {
  private _commentService: IcommentService;

  constructor(commentService: IcommentService) {
    this._commentService = commentService;
  }

  // To insert comments
  public createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { requestId, commentText, userId } = req.body;
      if (!requestId || !commentText || !userId) {
        throw new AppError(
          "requestId, commentText and userId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const comment = await this._commentService.createComment({
        requestId: requestId,
        commentText: commentText,
        userId: userId,
      });
      if (!comment) {
        throw new AppError(
          "Failed to create comment",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      res
        .status(StatusCode.OK)
        .json({ status: true, data: comment, message: "Message created" });
    } catch (error) {
      console.log("error in createComment/commentController", error);
      next(error);
    }
  };

  // To get comments of a request
  public getRequestComments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const requestId = req.params.id;
      if (!requestId) {
        throw new AppError("requestId is required", StatusCode.BAD_REQUEST);
      }

      const commentCount = req.query.count
        ? parseInt(req.query.count as string, 10)
        : 3;

      const comments = await this._commentService.getRequestComments({
        requestId,
        commentCount,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: comments,
        message: "Fectched all request messages",
      });
    } catch (error) {
      console.log("error in getRequestComments/commentController", error);
      next(error);
    }
  };
}
