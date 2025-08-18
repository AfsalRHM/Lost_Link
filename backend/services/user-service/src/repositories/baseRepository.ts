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

  async findEntities(
    filter: FilterQuery<T>,
    skip: number,
    limit: number
  ): Promise<{
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const [data, totalItems] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: Math.floor(skip / limit) + 1,
    };
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
