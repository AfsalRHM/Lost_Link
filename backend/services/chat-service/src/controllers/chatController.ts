import { Request, Response } from "express";
import IchatController from "../interface/IchatController";
import chatService from "../services/chatService";
import { validationResult } from "express-validator";

import jwtFunctions from "../utils/jwt";

export default class chatController implements IchatController {
  private _chatService: chatService;

  constructor() {
    this._chatService = new chatService();
  }

  public getUserChat = async (req: Request, res: Response): Promise<void> => {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        throw new Error("Access Token no exist");
      }
      const decoded = jwtFunctions.verifyAccessToken(accessToken);
      if (!decoded) {
        throw new Error("Access Token Expired");
      }

      const userId = decoded.id;

      // Here to start
      
    } catch (error) {
      console.log("error in getUserChat/chatController", error);
      return;
    }
  };
}
