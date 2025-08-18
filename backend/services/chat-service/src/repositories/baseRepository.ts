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

  async findAll(filter?: FilterQuery<T> | undefined): Promise<T[]> {
    if (filter) {
      return this.model.find(filter).populate("request_id");
    } else {
      return this.model.find();
    }
  }

  async findSome(filter: FilterQuery<T>): Promise<T[] | []> {
    return this.model.find(filter);
  }

  async findByIdAndUpdate(
    filter: FilterQuery<T>,
    update: Partial<T>
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(filter, update, { new: true });
  }
}
