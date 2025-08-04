import { Model, UpdateResult } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import InotificationModel from "../interface/InotificationModel";

export default class notificationRepository
  extends BaseRepository<InotificationModel>
  implements IbaseRepository<InotificationModel>
{
  constructor(model: Model<InotificationModel>) {
    super(model);
  }

  async insertChat(
    chatData: Partial<InotificationModel>
  ): Promise<InotificationModel | null> {
    return this.insert(chatData);
  }

  async findAllChats(): Promise<InotificationModel[] | null> {
    return this.findAll();
  }

  async findChat(userId: string): Promise<InotificationModel | null> {
    return this.findOne({ user_id: userId });
  }

  async updateAll(userId?: string): Promise<UpdateResult> {
    if (userId) {
      return this.updateMany(
        { sender: "admin", user_id: userId, seen: false }, // Filter for unseen notifications
        { $set: { seen: true } } // Update seen field to true
      );
    } else {
      return this.updateMany(
        { sender: "user", seen: false }, // Filter for unseen notifications
        { $set: { seen: true } } // Update seen field to true
      );
    }
  }
}
