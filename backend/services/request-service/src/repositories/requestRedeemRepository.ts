import IbaseRepository from "../interface/IbaseRepository";
import BaseRepository from "./baseRepository";
import IrequestRedeemModel from "../interface/IrequestRedeemModel";
import requestRedeemModel from "../models/requestRedeemModel";

export default class RequestRedeemRepository
  extends BaseRepository<IrequestRedeemModel>
  implements IbaseRepository<IrequestRedeemModel>
{
  constructor() {
    super(requestRedeemModel);
  }

  async insertRequestRedeemForm(
    requestRedeemData: Partial<IrequestRedeemModel>
  ): Promise<IrequestRedeemModel | null> {
    return this.insert(requestRedeemData);
  }

  async changeStatus({
    changeTo,
    redeemRequestId,
  }: {
    redeemRequestId: string;
    changeTo: string;
  }): Promise<IrequestRedeemModel | null> {
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
