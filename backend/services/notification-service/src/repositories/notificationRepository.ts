import { FilterQuery, Model, UpdateQuery, UpdateResult } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import InotificationModel from "../interface/InotificationModel";

export default class NotificationRepository
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

  async findManyNotification(
    filter: FilterQuery<InotificationModel>
  ): Promise<InotificationModel[] | []> {
    return this.findMany(filter);
  }

  async findAllNotification(): Promise<InotificationModel[] | []> {
    return this.findAll();
  }

  async findUserNotification(
    userId: string
  ): Promise<InotificationModel | null> {
    return this.findOne({ user_id: userId });
  }

  async findNotificationAndUpdate(
    filter: FilterQuery<InotificationModel>,
    update: UpdateQuery<InotificationModel>
  ): Promise<InotificationModel | null> {
    return this.findAndUpdate(filter, update);
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
