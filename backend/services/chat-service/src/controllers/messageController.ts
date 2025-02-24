import { Request, Response } from "express";
import ImessageController from "../interface/ImessageController";
import messageService from "../services/messageService";

import { getAdminIdFromToken, getUserIdFromToken } from "../utils/helpers";

export default class messageController implements ImessageController {
  private _messageService: messageService;

  constructor() {
    this._messageService = new messageService();
  }

  // To send the user messages
  public sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { content, chatId, image } = req.body; // Add Type
      if ( !chatId) {
        console.log("invalid data passed to the request send-message 1");
        res.status(404);
        return;
      }

      const token = req.header("Authorization")?.split(" ")[1];

      if (!token) {
        console.log("invalid data passed to the request send-message 2");
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
        image
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

  // To save the admin messages
  public sendAdminMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { content, chatId, image } = req.body; // Add Type
      if (!chatId) {
        console.log("invalid data passed to the request send-admin-message");
        res.status(404);
        return;
      }

      const token = req.header("Authorization")?.split(" ")[1];

      if (!token) {
        console.log("invalid data passed to the request send-admin-message");
        res.status(401);
        return;
      }
      const adminId = await getAdminIdFromToken({ token });

      if (!adminId) {
        console.log("invalid Token On messageController");
        res.status(401);
        return;
      }

      const response = await this._messageService.sendAdminMessage({
        content,
        chatId,
        adminId,
        image
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
