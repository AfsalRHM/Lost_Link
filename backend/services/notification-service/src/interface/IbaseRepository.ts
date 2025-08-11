import { DeleteResult, UpdateQuery, UpdateResult } from "mongoose";
import { FilterQuery, Document } from "mongoose";

export default interface IbaseRepository<T extends Document> {
  insert(data: Partial<T>): Promise<T>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findAll(filter: Partial<T>): Promise<T[]>;
  findMany(filter: FilterQuery<T>): Promise<T[] | []>;
  findAndUpdate(filter: FilterQuery<T>, update: Partial<T>): Promise<T | null>;
  updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<UpdateResult>;
}
