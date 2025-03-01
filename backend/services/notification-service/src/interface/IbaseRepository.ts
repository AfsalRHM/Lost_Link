import { DeleteResult, UpdateQuery, UpdateResult } from "mongoose";
import { FilterQuery, Document } from "mongoose";

export default interface IbaseRepository<T extends Document> {
  insert(data: Partial<T>): Promise<T>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findAll(filter: Partial<T>): Promise<T[]>;
  findSome(filter: FilterQuery<T>): Promise<T[] | null>;
  findByIdAndUpdate(Id: string, update: Partial<T>): Promise<T | null>;
  updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateResult>;
}
