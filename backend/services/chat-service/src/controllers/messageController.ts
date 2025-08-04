import { NextFunction, Request, Response } from "express";

import ImessageController from "../interface/ImessageController";
import ImessageService from "../interface/ImessageService";

import { StatusCode } from "../constants/statusCodes";
import { AppError } from "../utils/appError";
import extractUserFromHeaders from "../utils/extractUserFromHeaders";

export default class MessageController implements ImessageController {
  private _messageService: ImessageService;

  constructor(messageService: ImessageService) {
    this._messageService = messageService;
  }

  // To send the user messages
  public sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { content, chatId, image } = req.body;
      if (!chatId || !content || !image) {
        throw new AppError(
          "content, chatId and image is required",
          StatusCode.BAD_REQUEST
        );
      }

      const user = extractUserFromHeaders(req);
      if (!user || !user.id) {
        throw new AppError(
          "Unauthorized: User info missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const message = await this._messageService.sendMessage({
        content,
        chatId,
        userId: user.id,
        image,
      });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: message, message: "Message created" });
    } catch (error) {
      console.log("error in sendMessage/messageController", error);
      next(error);
    }
  };

  // To save the admin messages
  public sendAdminMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { content, chatId, image } = req.body;
      if (!chatId || !content || !image) {
        throw new AppError(
          "content, chatId and image is required",
          StatusCode.BAD_REQUEST
        );
      }

      const user = extractUserFromHeaders(req);
      if (!user || !user.id) {
        throw new AppError(
          "Unauthorized: User info missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const message = await this._messageService.sendAdminMessage({
        content,
        chatId,
        adminId: user.id,
        image,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: message,
        message: "Admin message created",
      });
    } catch (error) {
      console.log("error in sendMessage/messageController", error);
      next(error);
    }
  };

  // To get all the messages of a particular chat
  public getMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const chatId = req.params.id;
      if (!chatId) {
        throw new AppError("chatId is required", StatusCode.BAD_REQUEST);
      }

      const messages = await this._messageService.getMessages({ chatId });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: messages, message: "Messages fetched" });
    } catch (error) {
      console.log("error in getMessages/messageController", error);
      next(error);
    }
  };
}
