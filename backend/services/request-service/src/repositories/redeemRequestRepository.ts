import { FilterQuery, Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IredeemRequestModel from "../interface/IredeemRequestModel";
import { IredeemRequestRepository } from "../interface/IredeemRequestRepository";

export default class RedeemRequestRepository
  extends BaseRepository<IredeemRequestModel>
  implements IredeemRequestRepository
{
  constructor(model: Model<IredeemRequestModel>) {
    super(model);
  }

  async findRedeemRequest(
    filter: FilterQuery<IredeemRequestModel>
  ): Promise<IredeemRequestModel | null> {
    return this.findOne(filter);
  }

  async adminFindAllRedeemRequests(): Promise<IredeemRequestModel[] | []> {
    return this.findAll();
  }

  async adminFindRedeemRequests(
    filter: object,
    skip: number,
    limit: number
  ): Promise<any> {
    return this.findEntities(filter, skip, limit);
  }

  async findManyRedeemRequest(
    filter: FilterQuery<IredeemRequestModel>
  ): Promise<IredeemRequestModel[] | []> {
    return this.findAll(filter);
  }

  async insertRequestRedeemForm(
    requestRedeemData: Partial<IredeemRequestModel>
  ): Promise<IredeemRequestModel | null> {
    return this.insert(requestRedeemData);
  }

  async changeStatus({
    changeTo,
    redeemRequestId,
  }: {
    redeemRequestId: string;
    changeTo: string;
  }): Promise<IredeemRequestModel | null> {
    try {
      const request = await this.model.findById(redeemRequestId);
      if (!request) {
        console.log("Redeem Request not Found");
        throw new Error("Request not found");
      }

      const updatedRequest = await this.model.findByIdAndUpdate(
        redeemRequestId,
        {
          status: changeTo,
        },
        { new: true }
      );

      return updatedRequest;
    } catch (error) {
      console.error("Error updating status 5:", error);
      return null;
    }
  }
}
