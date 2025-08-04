import { Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import ImeetModel from "../interface/ImeetModel";

export default class meetRepository
  extends BaseRepository<ImeetModel>
  implements IbaseRepository<ImeetModel>
{
  constructor(model: Model<ImeetModel>) {
    super(model);
  }

  async insertMeet(meetData: Partial<ImeetModel>): Promise<ImeetModel | null> {
    return this.insert(meetData);
  }
}
