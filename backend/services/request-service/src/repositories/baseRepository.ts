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
    return this.model.findOne(filter);
  }

  async findAll(filter?: FilterQuery<T> | undefined): Promise<T[]> {
    if (filter) {
      return this.model.find(filter);
    } else {
      return this.model.find();
    }
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

  async findCommentsLimit({
    request_id,
    commentCount,
  }: {
    request_id: string;
    commentCount: number;
  }): Promise<T[]> {
    return this.model
      .find({ request_id: request_id })
      .sort({ createdAt: -1 })
      .limit(commentCount);
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
