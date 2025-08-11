import { FilterQuery } from "mongoose";

import IcommentModel from "./IcommentModel";

export interface IcommentRepository {
  insertComment(data: Partial<IcommentModel>): Promise<IcommentModel>;
  findMany(filter: FilterQuery<IcommentModel>): Promise<IcommentModel[] | []>;
  findComments({
    request_id1,
    commentCount,
  }: {
    request_id1: string;
    commentCount: number;
  }): Promise<IcommentModel[] | null>;
}
