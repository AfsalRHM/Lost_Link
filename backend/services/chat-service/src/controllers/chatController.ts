import { NextFunction, Request, Response } from "express";

import IchatController from "../interface/IchatController";
import IchatService from "../interface/IchatService";

import extractUserFromHeaders from "../utils/extractUserFromHeaders";
import { StatusCode } from "../constants/statusCodes";
import { AppError } from "../utils/appError";

export default class ChatController implements IchatController {
  private _chatService: IchatService;

  constructor(chatService: IchatService) {
    this._chatService = chatService;
  }

  // To Create or Fetch the Chat
  public getUserChat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const requestId = req.params.id;
      if (!requestId) {
        throw new AppError("requestId is required", StatusCode.BAD_REQUEST);
      }

      const user = extractUserFromHeaders(req);
      if (!user || !user.id) {
        throw new AppError(
          "Unauthorized: User info missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const chat = await this._chatService.getUserChat({
        userId: user.id,
        requestId,
      });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: chat, message: "User chat fetched" });
    } catch (error) {
      console.log("error in getUserChat/chatController", error);
      next(error);
    }
  };

  // To fetch all the chats
  public getAllChats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const chats = await this._chatService.getAllChats();

      res
        .status(StatusCode.OK)
        .json({ status: true, data: chats, message: "All chats fetched" });
    } catch (error) {
      console.log("error in getAllChats/chatController", error);
      next(error);
    }
  };

  // To fetch all the chats of a specific user
  public getAllUserChats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const chats = await this._chatService.getAllUserChats({ userId });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: chats, message: "All user chats fetched" });
    } catch (error) {
      console.log("error in getAllUserChats/chatController", error);
      next(error);
    }
  };

  // To fetch the user chat details to the admin
  public getChatDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const chatId = req.body.chatId;
      if (!chatId) {
        throw new AppError("chatId is required", StatusCode.BAD_REQUEST);
      }

      const chat = await this._chatService.getChatDetails({
        chatId: chatId,
      });
      if (!chat) {
        throw new AppError("Chat not found", StatusCode.NOT_FOUND);
      }

      res
        .status(StatusCode.OK)
        .json({ status: true, data: chat, message: "Chat details fetched" });
    } catch (error) {
      console.log("error in getChatDetails/chatController", error);
      next(error);
    }
  };
}
