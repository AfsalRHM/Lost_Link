import { Request, Response } from "express";
import InotificationController from "../interface/InotificationController";
import notificationService from "../services/notificationService";

export default class notificationController implements InotificationController {
  private _notificationService: notificationService;

  constructor() {
    this._notificationService = new notificationService();
  }
}
