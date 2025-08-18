import { DeleteResult, FilterQuery, Document } from "mongoose";

export default interface IbaseRepository<T extends Document> {
  insert(data: Partial<T>): Promise<T>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findAll(): Promise<T[]>;
  findEntities(
    filter: FilterQuery<T>,
    skip: number,
    limit: number
  ): Promise<{
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }>;
  findMany(filter: FilterQuery<T>): Promise<T[]>;
  findByIdAndUpdate(Id: string, update: Partial<T>): Promise<T | null>;
  deleteMany(filter: FilterQuery<T>): Promise<DeleteResult>;
}
