import { FilterQuery, Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import ImeetModel from "../interface/ImeetModel";

export default class MeetRepository
  extends BaseRepository<ImeetModel>
  implements IbaseRepository<ImeetModel>
{
  constructor(model: Model<ImeetModel>) {
    super(model);
  }

  async findAllMeets(): Promise<ImeetModel[] | []> {
    return this.findAll();
  }

  findMeet(filter: FilterQuery<ImeetModel>): Promise<ImeetModel | null> {
    return this.findOne(filter);
  }

  findManyMeet(filter: FilterQuery<ImeetModel>): Promise<ImeetModel[] | []> {
    return this.findAll(filter);
  }

  async insertMeet(meetData: Partial<ImeetModel>): Promise<ImeetModel | null> {
    return this.insert(meetData);
  }
}
