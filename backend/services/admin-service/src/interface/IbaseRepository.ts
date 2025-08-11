import { FilterQuery, Document } from "mongoose";

export default interface IbaseRepository<T extends Document> {
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  insert(data: Partial<T>): Promise<T>;
  findAllAdmins(): Promise<T[] | []>;
  findByIdAndUpdate(Id: string, update: Partial<T>): Promise<T | null>;
}
