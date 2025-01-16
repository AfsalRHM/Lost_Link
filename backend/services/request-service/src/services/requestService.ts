import IrequestModel from "../interface/IrequestModel";
import IrequestService from "../interface/IrequestService";
import requestRepository from "../repositories/requestRepository";
import jwtFunctions from "../utils/jwt";

export default class requestService implements IrequestService {
  private _requestRepository: requestRepository;

  constructor() {
    this._requestRepository = new requestRepository();
  }

  async insertRequest({
    accessToken,
    formData,
  }: {
    accessToken: string;
    formData: any;
  }): Promise<any> {
    const decoded = jwtFunctions.verifyAccessToken(accessToken);
    if (decoded) {
      const userId = decoded.userId;
      const requestData = {
        user_id: userId,
        product_name: formData.productName,
        reward_amount: formData.requestReward,
        product_category: formData.productCategory,
        missing_place: formData.missingPlace,
        mode_of_travel: formData.travelMode,
        missing_route: formData.travelRoutes,
        missing_date: formData.missingDate,
        expiration_date: formData.expirationLimit,
        product_images: formData.images,
        additional_information: formData.additionalInfo,
      };
      const insertedData = await this._requestRepository.insertRequest(
        requestData
      );
      if (insertedData) {
        return {
          status: true,
          data: insertedData,
          message: "Request Created successfully",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Request Creation Failed",
        };
      }
    }
  }

  async getRequests(): Promise<any> {
    try {
    } catch (error) {}
    const requests = await this._requestRepository.findAllRequests();
    if (requests) {
      return {
        status: true,
        data: requests,
        message: "All Request recieved",
      };
    } else {
      return {
        status: false,
        data: null,
        message: "All Request Failed to fetch",
      };
    }
  }
}
