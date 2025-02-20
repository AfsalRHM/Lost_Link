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

  async findOneRedeemRequest(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).populate("request_id");
  }

  async findAll(filter?: FilterQuery<T> | undefined): Promise<T[]> {
    if (filter) {
      return this.model.find(filter).populate("request_id");
    } else {
      return this.model.find();
    }
  }

  async findAllRedeemRequest(
    filter?: FilterQuery<T> | undefined
  ): Promise<T[]> {
    if (filter) {
      return this.model.find(filter).populate("request_id");
    } else {
      return this.model.find().populate("request_id");
    }
  }

  async findByIdAndUpdate(Id: string, update: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(Id, update, { new: true });
  }

  async deleteMany(userEmail: string): Promise<DeleteResult> {
    return this.model.deleteMany({ email: userEmail }).exec();
  }
}
