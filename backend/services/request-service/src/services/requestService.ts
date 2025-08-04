import stripe from "stripe";

import requestModel from "../models/requestModel";
import redeemRequestModel from "../models/redeemRequestModel";
import reportModel from "../models/reportModel";

import IrequestModel from "../interface/IrequestModel";
import IrequestService from "../interface/IrequestService";

import requestRepository from "../repositories/requestRepository";
import reportRepository from "../repositories/reportRepository";
import redeemRequestRepository from "../repositories/redeemRequestRepository";

import calculateRequestExpiryDate from "../helpers/calculateRequestExpiryDate";
import calculatePoints from "../helpers/calculatePoints";
import calculateUserReward from "../helpers/calculateUserReward";

import sendToService from "../rabbitmq/producer";

import { AppError } from "../utils/appError";
import { StatusCode } from "../constants/statusCodes";
import { handleServiceError } from "../utils/errorHandler";

export default class RequestService implements IrequestService {
  private _requestRepository: requestRepository;
  private _redeemRequestRepository: redeemRequestRepository;
  private _reportRepository: reportRepository;

  constructor() {
    this._requestRepository = new requestRepository(requestModel);
    this._redeemRequestRepository = new redeemRequestRepository(
      redeemRequestModel
    );
    this._reportRepository = new reportRepository(reportModel);
  }

  async insertRequest({
    userId,
    formData,
  }: {
    userId: string;
    formData: any;
  }): Promise<any> {
    try {
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
        expiration_date: calculateRequestExpiryDate({
          expirationLimit: formData.expirationLimit,
        }),
        product_images: formData.images,
        additional_information: formData.additionalInfo,
      };

      const insertedData: IrequestModel | null =
        await this._requestRepository.insertRequest(requestData);
      if (!insertedData) {
        throw new AppError(
          "Failed to create user",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      const sendingTo = process.env.USER_QUEUE;
      const source = "Add the request Id to the user";
      const props = {
        userId,
        requestId: insertedData._id.toString(),
      };

      if (!sendingTo) {
        throw new Error("sendigTo env is not accessible, from request service");
      }

      sendToService({
        sendingTo,
        source,
        props,
      });

      return insertedData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while creating request");
    }
  }

  async getUserRequests(userId: string): Promise<any> {
    try {
      const userRequests = await this._requestRepository.findUserRequests(
        userId
      );
      if (!userRequests) {
        throw new AppError(
          "Failed to fetch requests",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return userRequests;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching user requests"
      );
    }
  }

  // To get the request details for user side with the redeem request data also.
  async getRequestDetails({
    requestId,
    userId,
    from,
  }: {
    requestId: string;
    userId: string;
    from: string;
  }): Promise<any> {
    try {
      if (!requestId) {
        throw new AppError("requestId is required", StatusCode.BAD_REQUEST);
      }

      const requestData = await this._requestRepository.findOne({
        _id: requestId,
      });

      if (from == "normalRequest") {
        if (requestData?.user_id == userId) {
          throw new AppError("Invalid Access", StatusCode.FORBIDDEN);
        }

        if (
          requestData?.status == "cancelled" ||
          requestData?.status == "inactive"
        ) {
          throw new AppError("Request not found", StatusCode.NOT_FOUND);
        }
      }

      const redeemRequestData = await this._redeemRequestRepository.findOne({
        request_id: requestId,
        user_id: userId,
      });

      const reportData = await this._reportRepository.findOne({
        request_id: requestId,
        user_id: userId,
      });

      let data;
      if (redeemRequestData) {
        data = { requestData, redeemRequestData, reportData };
      } else {
        data = { requestData, reportData };
      }

      return data;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching request details"
      );
    }
  }

  // To get the request details for admin side with the redeem request data also.
  async adminGetRequestDetails({
    requestId,
  }: {
    requestId: string;
  }): Promise<any> {
    try {
      if (!requestId) {
        throw new AppError("requestId is required", StatusCode.BAD_REQUEST);
      }

      const requestData = await this._requestRepository.findOne({
        _id: requestId,
      });
      if (!requestData) {
        throw new AppError("request not found", StatusCode.NOT_FOUND);
      }

      const redeemRequestData =
        await this._redeemRequestRepository.findAllRedeemRequest({
          request_id: requestId,
        });
      const reportData = await this._reportRepository.findAll({
        request_id: requestId,
      });

      let data = {
        requestData,
        redeemRequestData: redeemRequestData.length ? redeemRequestData : null,
        reportData: reportData.length ? reportData : null,
      };

      return data;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching request details for admin"
      );
    }
  }

  async cancelRequest({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<any> {
    try {
      if (!requestId || !userId) {
        throw new AppError(
          "requestId and userId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const requestExist: IrequestModel | null =
        await this._requestRepository.findOne({ _id: requestId });
      if (!requestExist) {
        throw new AppError("Request not found", StatusCode.NOT_FOUND);
      }

      if (requestExist.user_id !== userId && userId !== "admin") {
        throw new AppError("Action not allowed", StatusCode.FORBIDDEN);
      }

      const requestData = await this._requestRepository.findByIdAndUpdate(
        requestId,
        { status: "cancelled" }
      );
      if (!requestData) {
        throw new AppError(
          "Failed to update the request status",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return requestData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while canceling a request"
      );
    }
  }

  async changeLikeStatus({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string | undefined;
  }): Promise<any> {
    try {
      if (!requestId || !userId) {
        throw new AppError(
          "requestId and userId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const requestData: IrequestModel | null =
        await this._requestRepository.findOne({ _id: requestId });
      if (!requestData) {
        throw new AppError("Request not found", StatusCode.NOT_FOUND);
      }

      let newRequestData;
      if (requestData.users_liked.includes(userId)) {
        newRequestData = await this._requestRepository.findByIdAndDislike({
          requestId,
          userId,
        });
      } else {
        newRequestData = await this._requestRepository.findByIdAndLike({
          requestId,
          userId,
        });
      }

      return newRequestData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while updating request for like"
      );
    }
  }

  async getRequestDataById({ requestId }: { requestId: string }): Promise<any> {
    try {
      const requestData = await this._requestRepository.findOne({
        _id: requestId,
      });
      if (!requestData) {
        throw new AppError("Request not found", StatusCode.NOT_FOUND);
      }

      return requestData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while fetching request");
    }
  }

  async createRedeemRequest({
    requestId,
    formData,
    userId,
  }: {
    requestId: string;
    formData: any;
    userId: string;
  }): Promise<any> {
    try {
      if (!requestId || !formData || !userId) {
        throw new AppError(
          "requestId, formData and userId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const updatedFormData = {
        user_id: userId,
        request_id: requestId,
        found_location: formData.foundLocation,
        found_date: formData.foundDate,
        damage_issues: formData.damageIssues,
        mobile_number: formData.mobileNumber,
        bank_name: formData.bankName,
        account_number: formData.accountNumber,
        ifsc_code: formData.ifscCode,
        account_holder_name: formData.accountHolderName,
        images: formData.images,
      };

      const redeemRequestData =
        await this._redeemRequestRepository.insertRequestRedeemForm(
          updatedFormData
        );
      if (!redeemRequestData) {
        throw new AppError(
          "Failed to create redeem request data",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return redeemRequestData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while inserting redeem request"
      );
    }
  }

  // To find all the user redeem requests
  async getUserRedeemRequests({ userId }: { userId: string }): Promise<any> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const redeemRequests = await this._redeemRequestRepository.findAll({
        user_id: userId,
      });

      return redeemRequests;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching user's redeem requests"
      );
    }
  }

  // To fetch the request redeem data
  async getRedeemRequestDetails({
    redeemRequestId,
  }: {
    redeemRequestId: string;
  }): Promise<any> {
    try {
      if (!redeemRequestId) {
        throw new AppError(
          "redeemRequestId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const redeemRequestData =
        await this._redeemRequestRepository.findOneRedeemRequest({
          _id: redeemRequestId,
        });
      if (!redeemRequestData) {
        throw new AppError("Redeem request not found", StatusCode.NOT_FOUND);
      }

      return redeemRequestData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching redeem request"
      );
    }
  }

  // To find all the requests
  async getRequests(): Promise<any> {
    try {
      const requests = await this._requestRepository.findAllRequests();

      return requests;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while fetching requests");
    }
  }

  // To Fetch all the Redeem Requests
  async getAllRedeemRequests(): Promise<any> {
    try {
      const redeemRrequests =
        await this._redeemRequestRepository.findAllRedeemRequest();

      return redeemRrequests;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching redeem requests"
      );
    }
  }

  async makePayment(formData: any): Promise<any> {
    try {
      const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
      if (!STRIPE_SECRET_KEY) {
        console.log("Stripe key not provided");
        throw new AppError(
          "Stripe configuration missing",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      if (!formData) {
        throw new AppError("formData is required", StatusCode.BAD_REQUEST);
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
        success_url: `${process.env.HOSTED_ROUTE}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.HOSTED_ROUTE}/payment-cancel`,
      });

      return { sessionId: session.id };
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while creating payment session"
      );
    }
  }

  async changeRequestStatus(props: { requestId: string }): Promise<any> {
    try {
      const requestData = await this._requestRepository.changeStatus(
        props.requestId
      );
      if (!requestData) {
        throw new AppError(
          "Failed to updated the request status",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return requestData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while updating request status"
      );
    }
  }

  async changeRedeemRequestStatus({
    redeemRequestId,
    changeTo,
  }: {
    redeemRequestId: string;
    changeTo: string;
  }): Promise<any> {
    try {
      if (!redeemRequestId || !changeTo) {
        throw new AppError(
          "redeemRequestId and changeTo is required",
          StatusCode.BAD_REQUEST
        );
      }

      if (changeTo !== "accepted" && changeTo !== "rejected") {
        throw new AppError("Action not supported", StatusCode.CONFLICT);
      }

      const redeemRequest = await this._redeemRequestRepository.changeStatus({
        redeemRequestId,
        changeTo,
      });
      if (!redeemRequest) {
        throw new AppError(
          "Failed to updated the redeem request status",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      if (changeTo == "accepted") {
        const requestData = await this._requestRepository.findByIdAndUpdate(
          redeemRequest.request_id,
          {
            status: changeTo,
          }
        );
        if (!requestData) {
          throw new AppError(
            "Failed to update request",
            StatusCode.INTERNAL_SERVER_ERROR
          );
        }

        const calculatedPoints = calculatePoints({
          rewardAmount: requestData.reward_amount,
        });

        const calculatedUserReward = calculateUserReward({
          rewardAmount: requestData.reward_amount,
        });

        const sendingTo = process.env.USER_QUEUE;
        const source = "Add the completed request details to the user";
        const props = {
          userId: redeemRequest?.user_id,
          requestId: requestData?._id.toString(),
          points: calculatedPoints,
          rewardAmount: calculatedUserReward,
        };

        if (!sendingTo) {
          throw new Error(
            "sendigTo env is not accessible, from request service"
          );
        }

        sendToService({
          sendingTo,
          source,
          props,
        });
      }
      return redeemRequest;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while updating redeem request status"
      );
    }
  }
}
