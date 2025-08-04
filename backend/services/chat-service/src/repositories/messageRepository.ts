import { Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import ImessageModel from "../interface/ImessageModel";

export default class messageRepository
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

  async findMessagesOfUser(userId: string): Promise<ImessageModel | null> {
    return this.findOne({ user_id: userId });
  }
}
