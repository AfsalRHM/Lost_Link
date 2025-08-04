import { Document, Model, FilterQuery, DeleteResult } from "mongoose";

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

  async findMany(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async findByIdAndUpdate(Id: string, update: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(Id, update, { new: true });
  }

  async deleteMany(filter: FilterQuery<T>): Promise<DeleteResult> {
    return this.model.deleteMany(filter).exec();
  }
}
