import { FilterQuery } from "mongoose";

import IrequestModel from "./IrequestModel";

export interface IrequestRepository {
  insertRequest(
    requestData: Partial<IrequestModel>
  ): Promise<IrequestModel | null>;
  findAllRequests(): Promise<IrequestModel[] | []>;
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
