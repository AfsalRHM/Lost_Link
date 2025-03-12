import IbaseRepository from "../interface/IbaseRepository";
import BaseRepository from "./baseRepository";
import ImeetModel from "../interface/ImeetModel";
import meetModel from "../model/meetModel";

export default class meetRepository
  extends BaseRepository<ImeetModel>
  implements IbaseRepository<ImeetModel>
{
  constructor() {
    super(meetModel);
  }

  async insertMeet(meetData: Partial<ImeetModel>): Promise<ImeetModel | null> {
    return this.insert(meetData);
  }

  //   async findMessagesOfUser(userId: string): Promise<ImessageModel | null> {
  //     return this.findOne({ user_id: userId });
  //   }
}
