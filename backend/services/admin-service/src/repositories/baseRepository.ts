import { Document, Model, FilterQuery } from "mongoose";

import IbaseRepository from "../interface/IbaseRepository";

export default class BaseRepository<T extends Document>
  implements IbaseRepository<T>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async insert(data: Partial<T>): Promise<T> {
    const newItem = new this.model(data);
    return newItem.save();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async findAllAdmins(): Promise<T[] | null> {
    return this.model.find({role: "Moderator"});
  }

  async findByIdAndUpdate(Id: string, update: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(Id, update, { new: true });
  }
}
