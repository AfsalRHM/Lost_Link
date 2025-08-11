import { FilterQuery, UpdateQuery, UpdateResult } from "mongoose";

import InotificationModel from "./InotificationModel";

export interface InotificationRepository {
  insertChat(
    chatData: Partial<InotificationModel>
  ): Promise<InotificationModel | null>;
  findManyNotification(
    filter: FilterQuery<InotificationModel>
  ): Promise<InotificationModel[] | []>;
  findNotificationAndUpdate(
    filter: FilterQuery<InotificationModel>,
    update: UpdateQuery<InotificationModel>
  ): Promise<InotificationModel | null>;
  findAllNotification(): Promise<InotificationModel[] | null>;
  findUserNotification(userId: string): Promise<InotificationModel | null>;
  updateAll(userId?: string): Promise<UpdateResult>;
}
