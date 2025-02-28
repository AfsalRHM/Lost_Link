import IbaseRepository from "../interface/IbaseRepository";
import BaseRepository from "./baseRepository";
import InotificationModel from "../interface/InotificationModel";
import notificationModel from "../model/notificationModel";

export default class notificationRepository
  extends BaseRepository<InotificationModel>
  implements IbaseRepository<InotificationModel>
{
  constructor() {
    super(notificationModel);
  }

  async insertChat(chatData: Partial<InotificationModel>): Promise<InotificationModel | null> {
    return this.insert(chatData);
  }

  async findAllChats(): Promise<InotificationModel[] | null> {
    return this.findAll();
  }

  async findChat(userId: string): Promise<InotificationModel | null> {
    return this.findOne({ user_id: userId });
  }
}
