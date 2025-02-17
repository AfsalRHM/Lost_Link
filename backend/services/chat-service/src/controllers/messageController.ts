import { Request, Response } from "express";
import ImessageController from "../interface/ImessageController";
import messageService from "../services/messageService";

import { getUserIdFromToken } from "../utils/helpers";

export default class messageController implements ImessageController {
  private _messageService: messageService;

  constructor() {
    this._messageService = new messageService();
  }

  public sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { content, chatId } = req.body; // Add Type
      if (!content || !chatId) {
        console.log("invalid data passed to the request send-message");
        res.status(404);
        return;
      }

      const token = req.header("Authorization")?.split(" ")[1];

      if (!token) {
        console.log("invalid data passed to the request send-message");
        res.status(401);
        return;
      }
      const userId = await getUserIdFromToken({ token });

      if (!userId) {
        console.log("invalid Token On messageController");
        res.status(401);
        return;
      }

      const response = await this._messageService.sendMessage({
        content,
        chatId,
        userId,
      });

      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(402).json(response);
      }
    } catch (error) {
      console.log("error in sendMessage/messageController", error);
      return;
    }
  };

  // To get all the messages of a particular chat
  public getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { chatId } = req.params;
      if (!chatId) {
        console.log("invalid data passed to the request get-messages");
        res.status(404);
        return;
      }

      const response = await this._messageService.getMessages({ chatId });

      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(402).json(response);
      }
    } catch (error) {
      console.log("error in getMessages/messageController", error);
      return;
    }
  };
}
