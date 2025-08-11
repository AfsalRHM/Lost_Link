import { FilterQuery, Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import ImessageModel from "../interface/ImessageModel";

export default class MessageRepository
  extends BaseRepository<ImessageModel>
  implements IbaseRepository<ImessageModel>
{
  constructor(model: Model<ImessageModel>) {
    super(model);
  }

  async insertMessage(
    messageData: Partial<ImessageModel>
  ): Promise<ImessageModel | null> {
    return this.insert(messageData);
  }

  async findMessages(
    filter: FilterQuery<ImessageModel>
  ): Promise<ImessageModel[] | []> {
    return this.findSome(filter);
  }

  async findMessagesOfUser(userId: string): Promise<ImessageModel | null> {
    return this.findOne({ user_id: userId });
  }
}
