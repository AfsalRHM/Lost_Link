import { FilterQuery } from "mongoose";

import IrequestModel from "./IrequestModel";

export interface IrequestRepository {
  insertRequest(
    requestData: Partial<IrequestModel>
  ): Promise<IrequestModel | null>;
  findAllRequests(
    filter: FilterQuery<IrequestModel>
  ): Promise<IrequestModel[] | []>;
  adminFindRequests(filter: object, skip: number, limit: number): Promise<any>;
  adminFindAllRequests(): Promise<IrequestModel[] | []>;
  findRequest(
    filter: FilterQuery<IrequestModel>
  ): Promise<IrequestModel | null>;
  findRequestAndUpdate(
    filter: FilterQuery<IrequestModel>,
    update: Partial<IrequestModel>
  ): Promise<IrequestModel | null>;
  changeStatus(requestId: string): Promise<IrequestModel | null>;
  findUserRequests(userId: string): Promise<IrequestModel[] | null>;
  findByIdAndDislike({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<IrequestModel | null>;
  findByIdAndLike({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<IrequestModel | null>;
}
