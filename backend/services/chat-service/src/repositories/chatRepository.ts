import { Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import IchatModel from "../interface/IchatModel";

export default class chatRepository
  extends BaseRepository<IchatModel>
  implements IbaseRepository<IchatModel>
{
  constructor(model: Model<IchatModel>) {
    super(model);
  }

  async insertChat(chatData: Partial<IchatModel>): Promise<IchatModel | null> {
    return this.insert(chatData);
  }

  async findAllChats(): Promise<IchatModel[] | null> {
    return this.findAll();
  }

  async findChat(userId: string): Promise<IchatModel | null> {
    return this.findOne({ user_id: userId });
  }
}
