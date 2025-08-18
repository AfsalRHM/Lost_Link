import stripe from "stripe";

import IrequestModel from "../interface/IrequestModel";
import IrequestService from "../interface/IrequestService";
import IredeemRequestModel from "../interface/IredeemRequestModel";
import { IrequestRepository } from "../interface/IrequestRepository";
import { IreportRepository } from "../interface/IreportRepository";
import { IredeemRequestRepository } from "../interface/IredeemRequestRepository";

import calculateRequestExpiryDate from "../helpers/calculateRequestExpiryDate";
import calculatePoints from "../helpers/calculatePoints";
import calculateUserReward from "../helpers/calculateUserReward";

import sendToService from "../rabbitmq/producer";
import { StatusCode } from "../constants/statusCodes";

import { AppError } from "../utils/appError";
import { handleServiceError } from "../utils/errorHandler";

import { RequestMapper } from "../mappers/request.mapper";
import { ReportMapper } from "../mappers/report.mapper";
import { RedeemRequestMapper } from "../mappers/redeemRequest.mapper";

import { CreateRequestRequestDto } from "../dtos/request/createRequest.dto";
import { AdminGetAllRequestsResponseDto } from "../dtos/request/getAllRequests.dto";
import { adminGetAllRedeemRequestsResponseDto } from "../dtos/redeemRequest/getAllRedeemRequests.dto";

export default class RequestService implements IrequestService {
  private _requestRepository: IrequestRepository;
  private _redeemRequestRepository: IredeemRequestRepository;
  private _reportRepository: IreportRepository;

  constructor(
    requestRepository: IrequestRepository,
    redeemRequestRepository: IredeemRequestRepository,
    reportRepository: IreportRepository
  ) {
    this._requestRepository = requestRepository;
    this._redeemRequestRepository = redeemRequestRepository;
    this._reportRepository = reportRepository;
  }

  async insertRequest({
    userId,
    formData,
  }: {
    userId: string;
    formData: any;
  }): Promise<void> {
    try {
      const requestData: CreateRequestRequestDto = {
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

      return;
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

      const filteredRequests = userRequests.map((request) => {
        const savedEntity = RequestMapper.toEntity(request);
        return RequestMapper.toGetRequestSummaryDto(savedEntity);
      });

      return filteredRequests;
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

      const requestData = await this._requestRepository.findRequest({
        _id: requestId,
      });
      if (!requestData) {
        throw new AppError("request not found", StatusCode.NOT_FOUND);
      }

      const requestEntity = RequestMapper.toEntity(requestData);
      const mappedRequest = RequestMapper.toGetRequestDetailsDto(requestEntity);

      if (from == "normalRequest") {
        if (requestData?.user_id == userId) {
          throw new AppError("Invalid Access", StatusCode.FORBIDDEN);
        }

        // if (
        //   requestData?.status == "cancelled" ||
        //   requestData?.status == "inactive"
        // ) {
        //   throw new AppError("Request not found", StatusCode.NOT_FOUND);
        // }
      }

      if (from == "profile") {
        return { requestData: mappedRequest };
      }

      const redeemRequestData =
        await this._redeemRequestRepository.findRedeemRequest({
          request_id: requestId,
          user_id: userId,
        });

      const reportData = await this._reportRepository.findReport({
        request_id: requestId,
        user_id: userId,
      });

      let data;
      if (redeemRequestData) {
        data = { requestData: mappedRequest, redeemRequestData, reportData };
      } else {
        data = { requestData: mappedRequest, reportData };
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

  async getMyRequestDetails({
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

      const requestData = await this._requestRepository.findRequest({
        _id: requestId,
      });
      if (!requestData) {
        throw new AppError("request not found", StatusCode.NOT_FOUND);
      }

      const requestEntity = RequestMapper.toEntity(requestData);

      return RequestMapper.toGetRequestDetailsDto(requestEntity);
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching my request details"
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

      const requestData = await this._requestRepository.findRequest({
        _id: requestId,
      });
      if (!requestData) {
        throw new AppError("request not found", StatusCode.NOT_FOUND);
      }

      const redeemRequestData =
        await this._redeemRequestRepository.findManyRedeemRequest({
          request_id: requestId,
        });
      const reportData = await this._reportRepository.findManyReport({
        request_id: requestId,
      });

      const requestEntity = RequestMapper.toEntity(requestData);
      const mappedRequests =
        RequestMapper.toGetRequestDetailsDto(requestEntity);

      const mappedRedeemRequests = redeemRequestData.length
        ? redeemRequestData.map((doc) =>
            RedeemRequestMapper.toGetRedeemRequestSummaryDto(
              RedeemRequestMapper.toEntity(doc)
            )
          )
        : null;

      const mappedReports = reportData.length
        ? reportData.map((doc) =>
            ReportMapper.toGetReportSummaryDto(ReportMapper.toEntity(doc))
          )
        : null;

      let data = {
        requestData: mappedRequests,
        redeemRequestData: mappedRedeemRequests,
        reportData: mappedReports,
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
  }): Promise<void> {
    try {
      if (!requestId || !userId) {
        throw new AppError(
          "requestId and userId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const requestExist: IrequestModel | null =
        await this._requestRepository.findRequest({ _id: requestId });
      if (!requestExist) {
        throw new AppError("Request not found", StatusCode.NOT_FOUND);
      }

      if (requestExist.user_id !== userId && userId !== "admin") {
        throw new AppError("Action not allowed", StatusCode.FORBIDDEN);
      }

      const requestData = await this._requestRepository.findRequestAndUpdate(
        { _id: requestId },
        { status: "cancelled" }
      );
      if (!requestData) {
        throw new AppError(
          "Failed to update the request status",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
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
  }): Promise<void> {
    try {
      if (!requestId || !userId) {
        throw new AppError(
          "requestId and userId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const requestData: IrequestModel | null =
        await this._requestRepository.findRequest({ _id: requestId });
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
      if (!newRequestData) {
        throw new AppError(
          "Failed to update the like count of request",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
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
      const requestData = await this._requestRepository.findRequest({
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

      const requestData = await this._requestRepository.findRequest({
        _id: requestId,
      });
      if (!requestData) {
        throw new AppError("request not found", StatusCode.NOT_FOUND);
      }

      const updatedFormData = {
        user_id: userId,
        request_id: requestId,
        request_name: requestData.product_name,
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

      const redeemRequests =
        await this._redeemRequestRepository.findManyRedeemRequest({
          user_id: userId,
        });

      const mappedRedeemRequests = redeemRequests.map((redeemRequestEntity) =>
        RedeemRequestMapper.toGetAllRedeemRequestsDto(
          RedeemRequestMapper.toEntity(redeemRequestEntity)
        )
      );

      return mappedRedeemRequests;
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
        await this._redeemRequestRepository.findRedeemRequest({
          _id: redeemRequestId,
        });
      if (!redeemRequestData) {
        throw new AppError("Redeem request not found", StatusCode.NOT_FOUND);
      }

      const redeemRequestEntity =
        RedeemRequestMapper.toEntity(redeemRequestData);

      return RedeemRequestMapper.toAdminGetRedeemRequestDetailsDto(
        redeemRequestEntity
      );
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
  async getRequests({
    min,
    max,
    location,
  }: {
    min: number;
    max: number;
    location: string;
  }): Promise<any> {
    try {
      const filter = {
        $and: [
          { reward_amount: { $gte: min, $lte: max } },
          {
            $or: [
              { missing_place: { $regex: location, $options: "i" } },
              { missing_route: { $regex: location, $options: "i" } },
            ],
          },
        ],
      };

      const requests = await this._requestRepository.findAllRequests(filter);

      const mappedRequests = requests.map((doc) =>
        RequestMapper.toGetRequestDetailsDto(RequestMapper.toEntity(doc))
      );

      return mappedRequests;
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

  async adminGetRequests({
    search,
    limit,
    page,
  }: {
    search: string;
    limit: number;
    page: number;
  }): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const filter = search
        ? {
            $or: [
              { user_name: { $regex: search, $options: "i" } },
              { full_name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const response = await this._requestRepository.adminFindRequests(
        filter,
        skip,
        limit
      );

      const mappedRequests = response.data.map((request: IrequestModel) =>
        RequestMapper.toAdminGetAllRequests(RequestMapper.toEntity(request))
      );
      response.data = mappedRequests;

      return response;
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

  async adminGetAllRequests(): Promise<AdminGetAllRequestsResponseDto[] | []> {
    try {
      const response = await this._requestRepository.adminFindAllRequests();

      const mappedRequests = response.map((request: IrequestModel) =>
        RequestMapper.toAdminGetAllRequests(RequestMapper.toEntity(request))
      );

      return mappedRequests;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching all requests"
      );
    }
  }

  // To Fetch all the Redeem Requests
  async adminGetRedeemRequests({
    search,
    limit,
    page,
  }: {
    search: string;
    limit: number;
    page: number;
  }): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const filter = search
        ? {
            $or: [{ request_name: { $regex: search, $options: "i" } }],
          }
        : {};

      const response =
        await this._redeemRequestRepository.adminFindRedeemRequests(
          filter,
          skip,
          limit
        );

      const mappedRedeemRequests = response.data.map(
        (redeemRequest: IredeemRequestModel) =>
          RedeemRequestMapper.toAdminGetAllRedeemRequestsDto(
            RedeemRequestMapper.toEntity(redeemRequest)
          )
      );
      response.data = mappedRedeemRequests;

      return response;
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

  // To Fetch all the Redeem Requests
  async adminGetAllRedeemRequests(): Promise<
    adminGetAllRedeemRequestsResponseDto[] | []
  > {
    try {
      const response =
        await this._redeemRequestRepository.adminFindAllRedeemRequests();

      const mappedRedeemRequests = response.map(
        (redeemRequest: IredeemRequestModel) =>
          RedeemRequestMapper.toAdminGetAllRedeemRequestsDto(
            RedeemRequestMapper.toEntity(redeemRequest)
          )
      );

      return mappedRedeemRequests;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching all redeem requests"
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
        const requestData = await this._requestRepository.findRequestAndUpdate(
          { _id: redeemRequest.request_id },
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
