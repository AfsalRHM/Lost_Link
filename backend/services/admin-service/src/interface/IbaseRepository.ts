import { FilterQuery, Document } from "mongoose";

export default interface IbaseRepository<T extends Document> {
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  insert(data: Partial<T>): Promise<T>;
  findAll(): Promise<T[] | []>;
  findByIdAndUpdate(Id: string, update: Partial<T>): Promise<T | null>;
  countDocuments(filter: FilterQuery<T>): Promise<number>;
  findSome(filter: FilterQuery<T>, skip: number, limit: number): Promise<T[] | []>
  findPaginated(filter: FilterQuery<T>, skip: number, limit: number): Promise<{admins: T[]; totalItems: number; totalPages: number; currentPage: number;}>
}
