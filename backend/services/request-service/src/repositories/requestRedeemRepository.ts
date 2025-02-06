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
}
