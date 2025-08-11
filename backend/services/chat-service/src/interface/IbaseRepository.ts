import { FilterQuery, Document } from "mongoose";

export default interface IbaseRepository<T extends Document> {
  insert(data: Partial<T>): Promise<T>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findAll(filter?: FilterQuery<T> | undefined): Promise<T[]>;
  findSome(filter: FilterQuery<T>): Promise<T[] | []>;
  findByIdAndUpdate(
    filter: FilterQuery<T>,
    update: Partial<T>
  ): Promise<T | null>;
}
