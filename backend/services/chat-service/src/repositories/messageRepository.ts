import IbaseRepository from "../interface/IbaseRepository";
import BaseRepository from "./baseRepository";
import ImessageModel from "../interface/ImessageModel";
import messageModel from "../model/messageModel";

export default class messageRepository
  extends BaseRepository<ImessageModel>
  implements IbaseRepository<ImessageModel>
{
  constructor() {
    super(messageModel);
  }

  async insertMessage(messageData: Partial<ImessageModel>): Promise<ImessageModel | null> {
    return this.insert(messageData);
  }

  async findMessagesOfUser(userId: string): Promise<ImessageModel | null> {
    return this.findOne({ user_id: userId });
  }

}
