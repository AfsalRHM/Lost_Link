import { Request, Response } from "express";
import IchatController from "../interface/IchatController";
import chatService from "../services/chatService";

import jwtFunctions from "../utils/jwt";
import { StatusCode } from "../constants/statusCodes";

export default class chatController implements IchatController {
  private _chatService: chatService;

  constructor() {
    this._chatService = new chatService();
  }

  // To Create or Fetch the Chat
  public getUserChat = async (req: Request, res: Response): Promise<void> => {
    try {
      const requestId = req.params.id;
      if (!requestId) {
        throw new Error("Request Id not passed correctly");
      }
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        throw new Error("Access Token no exist");
      }
      const decoded = jwtFunctions.verifyAccessToken(accessToken);
      if (!decoded) {
        throw new Error("Access Token Expired");
      }

      const userId = decoded.id;

      const response = await this._chatService.getUserChat({
        userId,
        requestId,
      });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in getUserChat/chatController", error);
      return;
    }
  };

  // To fetch all the chats
  public getAllChats = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._chatService.getAllChats();

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in getUserChat/chatController", error);
      return;
    }
  };

  // To fetch all the chats of a specific user
  public getAllUserChats = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.params.id;

      if (!userId) {
        throw new Error("User Id not passed correctly");
      }

      const response = await this._chatService.getAllUserChats({ userId });

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
      console.log("error in getAllUserChats/chatController", error);
      return;
    }
  };

  // To fetch the user chat details to the admin
  public getChatDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const chatId = req.body.chatId;
      if (!chatId) {
        throw new Error("Request Id not passed correctly");
      }

      const response = await this._chatService.getChatDetails({
        chatId: chatId,
      });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in getChatDetails/chatController", error);
      return;
    }
  };
}
