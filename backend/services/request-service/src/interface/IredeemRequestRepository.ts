import { FilterQuery } from "mongoose";
import IredeemRequestModel from "./IredeemRequestModel";

export interface IredeemRequestRepository {
  findRedeemRequest(
    filter: FilterQuery<IredeemRequestModel>
  ): Promise<IredeemRequestModel | null>;
  findAllRedeemRequest(): Promise<IredeemRequestModel[] | []>;
  findManyRedeemRequest(
    filter: FilterQuery<IredeemRequestModel>
  ): Promise<IredeemRequestModel[] | []>;
  insertRequestRedeemForm(
    requestRedeemData: Partial<IredeemRequestModel>
  ): Promise<IredeemRequestModel | null>;
  changeStatus({
    changeTo,
    redeemRequestId,
  }: {
    redeemRequestId: string;
    changeTo: string;
  }): Promise<IredeemRequestModel | null>;
}
