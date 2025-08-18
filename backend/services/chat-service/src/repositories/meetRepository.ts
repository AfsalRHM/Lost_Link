import { FilterQuery, Model } from "mongoose";

import BaseRepository from "./baseRepository";

import ImeetModel from "../interface/ImeetModel";
import { ImeetRepository } from "../interface/ImeetRepository";

export default class MeetRepository
  extends BaseRepository<ImeetModel>
  implements ImeetRepository
{
  constructor(model: Model<ImeetModel>) {
    super(model);
  }

  async findMeets(filter: object, skip: number, limit: number): Promise<any> {
    return this.findEntities(filter, skip, limit);
  }

  async findMeet(filter: FilterQuery<ImeetModel>): Promise<ImeetModel | null> {
    return this.findOne(filter);
  }

  async findManyMeet(
    filter: FilterQuery<ImeetModel>
  ): Promise<ImeetModel[] | []> {
    return this.findAll(filter);
  }

  async insertMeet(meetData: Partial<ImeetModel>): Promise<ImeetModel | null> {
    return this.insert(meetData);
  }
}
