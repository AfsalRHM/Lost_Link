import IbaseRepository from "../interface/IbaseRepository";
import BaseRepository from "./baseRepository";
import IchatModel from "../interface/IchatModel";
import chatModel from "../model/chatModel";

export default class chatRepository
  extends BaseRepository<IchatModel>
  implements IbaseRepository<IchatModel>
{
  constructor() {
    super(chatModel);
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
