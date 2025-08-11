import { FilterQuery, Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import IchatModel from "../interface/IchatModel";

export default class ChatRepository
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

  async findManyChats(
    filter: FilterQuery<IchatModel>
  ): Promise<IchatModel[] | []> {
    return this.findAll(filter);
  }

  async findChat(filter: FilterQuery<IchatModel>): Promise<IchatModel | null> {
    return this.findOne(filter);
  }

  async findMessageAndUpdate(
    filter: FilterQuery<IchatModel>,
    update: Partial<IchatModel>
  ): Promise<IchatModel | null> {
    return this.findByIdAndUpdate(filter, update);
  }
}
