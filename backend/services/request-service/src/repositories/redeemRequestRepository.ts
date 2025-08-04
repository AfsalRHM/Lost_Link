import { Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import IredeemRequestModel from "../interface/IredeemRequestModel";

export default class RedeemRequestRepository
  extends BaseRepository<IredeemRequestModel>
  implements IbaseRepository<IredeemRequestModel>
{
  constructor(model: Model<IredeemRequestModel>) {
    super(model);
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
