import IrequestModel from "../interface/IrequestModel";
import IrequestService from "../interface/IrequestService";
import sendToService from "../rabbitmq/producer";
import requestRepository from "../repositories/requestRepository";
import jwtFunctions from "../utils/jwt";

import stripe from "stripe";

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
      const userId = decoded.id;

      const expirationMonths = parseInt(
        formData.expirationLimit.split(" ")[0],
        10
      );

      const currentDate = new Date();
      const expiryDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + expirationMonths)
      );

      const requestData = {
        user_id: userId,
        product_name: formData.productName,
        reward_amount: formData.requestReward,
        product_category: formData.productCategory,
        last_seen: formData.lastSeen,
        missing_while: formData.missingWhile,
        missing_place: formData.missingPlace,
        mode_of_travel: formData.travelMode,
        missing_route: formData.travelRoutes,
        missing_date: formData.missingDate,
        expiration_validity: formData.expirationLimit,
        expiration_date: expiryDate,
        product_images: formData.images,
        additional_information: formData.additionalInfo,
      };

      const insertedData: IrequestModel | null =
        await this._requestRepository.insertRequest(requestData);

      if (insertedData) {
        const sendingTo = process.env.USER_QUEUE;
        const source = "Add the request Id to the user";
        const props = {
          userId,
          requestId: insertedData._id.toString(),
        };

        if (!sendingTo) {
          throw new Error("sendingTo is emplty...");
        }

        sendToService({
          sendingTo,
          source,
          props,
        });

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

  async getUserRequests(requestIds: [string]): Promise<any> {
    try {
      const userRequests = await this._requestRepository.findUserRequests(
        requestIds
      );
      if (userRequests) {
        return {
          status: true,
          data: userRequests,
          message: "All My Request Fetched",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "All My Request Failed to fetch",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message:
          "Error occured while getting all requests - from getUserRequests/requestService",
      };
    }
  }

  async getRequestDetails(requestIds: [string]): Promise<any> {
    try {
      const requestData = await this._requestRepository.findOne({
        _id: requestIds,
      });
      if (requestData) {
        return {
          status: true,
          data: requestData,
          message: "Request Data Found",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Request Data not Found",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message:
          "Error occured while Fetching Request Data - from getRequestDetails/requestService",
      };
    }
  }

  async getRequests(): Promise<any> {
    try {
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
    } catch (error) {
      return {
        status: false,
        data: null,
        message:
          "Error occured while getting all requests - from getRequests/requestService",
      };
    }
  }

  async makePayment(formData: any): Promise<any> {
    try {
      const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

      if (!STRIPE_SECRET_KEY) {
        console.log("Stripe key not provided");
        return {
          status: false,
          data: null,
          message: "Stripe key not provided",
        };
      }

      const stripeClient = new stripe(STRIPE_SECRET_KEY);

      const { requestReward, productName } = formData;
      const amount = parseInt(requestReward);

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: productName || "Product",
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.MAIN_ROUTE}${process.env.FRONTEND_PORT}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.MAIN_ROUTE}${process.env.FRONTEND_PORT}/payment-cancel`,
      });

      return {
        status: true,
        data: { sessionId: session.id },
        message: "Payment session created successfully.",
      };
    } catch (error) {
      console.error("Stripe Payment Error: ", error);

      return {
        status: false,
        data: null,
        message:
          "Error occured while making payment - from makePayment/requestService",
      };
    }
  }

  async changeRequestStatus(props: { requestId: string }): Promise<any> {
    try {
      const response = await this._requestRepository.changeStatus(
        props.requestId
      );
      if (response) {
        return {
          status: true,
          data: response,
          message: "Request Status Changed Successfully.",
        };
      } else {
        return {
          status: false,
          data: response,
          message: "Request Status Changed Successfully.",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "Error in getAllUsers/adminService",
        error: error,
      };
    }
  }
}
