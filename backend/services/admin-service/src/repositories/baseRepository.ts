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

  async findAll(): Promise<T[]> {
    return this.model.find({ role: "Moderator" });
  }

  async findSome(
    filter: FilterQuery<T>,
    skip: number,
    limit: number
  ): Promise<T[]> {
    return this.model.find(filter).skip(skip).limit(limit).exec();
  }

  async findPaginated(
    filter: FilterQuery<T>,
    skip: number,
    limit: number
  ): Promise<{
    admins: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const [data, totalItems] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      admins: data,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: Math.floor(skip / limit) + 1,
    };
  }

  async findByIdAndUpdate(Id: string, update: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(Id, update, { new: true });
  }

  async countDocuments(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
