import { DeleteResult } from "mongoose";
import { FilterQuery, Document } from "mongoose";

export default interface IbaseRepository<T extends Document> {
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findAll(filter: Partial<T>): Promise<T[]>;
  insert(data: Partial<T>): Promise<T>;
  findByIdAndUpdate(Id: string, update: Partial<T>): Promise<T | null>;
  deleteMany(id: string): Promise<DeleteResult>;
}
