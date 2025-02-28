import IrequestModel from "../interface/IrequestModel";
import IrequestService from "../interface/IrequestService";
import sendToService from "../rabbitmq/producer";
import requestRepository from "../repositories/requestRepository";
import requestRedeemRepository from "../repositories/requestRedeemRepository";
import reportRepository from "../repositories/reportRepository";
import jwtFunctions from "../utils/jwt";

import stripe from "stripe";

export default class requestService implements IrequestService {
  private _requestRepository: requestRepository;
  private _requestRedeemRepository: requestRedeemRepository;
  private _reportRepository: reportRepository;

  constructor() {
    this._requestRepository = new requestRepository();
    this._requestRedeemRepository = new requestRedeemRepository();
    this._reportRepository = new reportRepository();
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
          status: true,
          data: null,
          message: "No request on the database",
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
      const requestData = await this._requestRepository.findOne({
        _id: requestId,
      });

      if (from == "normalRequest") {
        if (requestData?.user_id == userId) {
          return {
            status: false,
            data: null,
            message: "Invalid Access on the Request",
          };
        }

        if (
          requestData?.status == "cancelled" ||
          requestData?.status == "inactive"
        ) {
          return {
            status: false,
            data: null,
            message: "Request not Available",
          };
        }
      }

      if (requestData) {
        const redeemRequestData = await this._requestRedeemRepository.findOne({
          request_id: requestId,
          user_id: userId,
        });

        const reportData = await this._reportRepository.findOne({
          request_id: requestId,
          user_id: userId,
        });

        if (redeemRequestData) {
          return {
            status: true,
            data: { requestData, redeemRequestData, reportData },
            message: "Request Data Found",
          };
        } else {
          return {
            status: true,
            data: { requestData, reportData },
            message: "Request Data Found",
          };
        }
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

  // To get the request details for admin side with the redeem request data also.
  async adminGetRequestDetails({
    requestId,
  }: {
    requestId: string;
  }): Promise<any> {
    try {
      const requestData = await this._requestRepository.findOne({
        _id: requestId,
      });

      if (requestData) {
        const redeemRequestData =
          await this._requestRedeemRepository.findAllRedeemRequest({
            request_id: requestId,
          });
        const reportData = await this._reportRepository.findAll({
          request_id: requestId,
        });
        if (redeemRequestData) {
          return {
            status: true,
            data: { requestData, redeemRequestData, reportData },
            message: "Request Data Found",
          };
        } else {
          return {
            status: true,
            data: { requestData, reportData },
            message: "Request Data Found",
          };
        }
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

  async cancelRequest({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string | undefined;
  }): Promise<any> {
    try {
      const requestData: IrequestModel | null =
        await this._requestRepository.findOne({ _id: requestId });
      if (!requestData) {
        return {
          status: false,
          data: null,
          message: "Request not found",
        };
      }
      if (requestData.user_id == userId) {
        const request = await this._requestRepository.findByIdAndUpdate(
          requestId,
          { status: "cancelled" }
        );
        if (request) {
          return {
            status: true,
            data: request,
            message: "Request Cancelled",
          };
        } else {
          return {
            status: false,
            data: null,
            message: "Request Cancellation failed",
          };
        }
      } else {
        return {
          status: false,
          data: null,
          message: "Invalid Action Detected",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message:
          "Error occured while cancelling the request - from cancelRequest/requestService",
      };
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
        return {
          status: false,
          data: null,
          message:
            "Data no reached here on the changeLikeStatus/requestService",
        };
      }
      const requestData: IrequestModel | null =
        await this._requestRepository.findOne({ _id: requestId });
      if (!requestData) {
        return {
          status: false,
          data: null,
          message: "Request not found",
        };
      }

      // change the add the user id to the users_liked array

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

      if (newRequestData) {
        return {
          status: true,
          data: newRequestData,
          message: "Changed the Like Status",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "unable to Change the Like Status",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: false,
        data: null,
        message:
          "Error occured while cancelling the request - from changeLikeStatus/requestService",
      };
    }
  }

  async getRequestDataById({ requestId }: { requestId: string }): Promise<any> {
    try {
      const requestData = await this._requestRepository.findOne({
        _id: requestId,
      });
      if (requestData) {
        return {
          status: true,
          data: requestData,
          message: "Request Data Available",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Request Un Available",
        };
      }
    } catch (error) {
      console.log(error, "error on the getRequestDataById/requestService");
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
      const requestRedeemData =
        await this._requestRedeemRepository.insertRequestRedeemForm(
          updatedFormData
        );
      if (requestRedeemData) {
        return {
          status: true,
          data: requestRedeemData,
          message: "Request Redeem Form Submitted",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Failed to submit Request Redeem Form",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message:
          "Error occured while getting all requests - from createRedeemRequest/requestService",
      };
    }
  }

  // To find all the user redeem requests
  async getUserRedeemRequests({ userId }: { userId: string }): Promise<any> {
    try {
      const redeemRequests = await this._requestRedeemRepository.findAll({
        user_id: userId,
      });
      if (redeemRequests) {
        return {
          status: true,
          data: redeemRequests,
          message: "All Redeem Request recieved",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "All Redeem Request Failed to fetch",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message:
          "Error occured while getting all redeem requests - from getUserRedeemRequests/requestService",
      };
    }
  }

  // To fetch the request redeem data
  async getRedeemRequestDetails({
    requestRedeemId,
  }: {
    requestRedeemId: string;
  }): Promise<any> {
    try {
      const redeemRequestData =
        await this._requestRedeemRepository.findOneRedeemRequest({
          _id: requestRedeemId,
        });
      if (redeemRequestData) {
        return {
          status: true,
          data: redeemRequestData,
          message: "Fetched the Redeem Request Data",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Failed to fetch the Redeem Request Data",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message:
          "Error occured while getting all redeem requests - from getUserRedeemRequests/requestService",
      };
    }
  }

  // To find all the requests
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

  // To Fetch all the Redeem Requests
  async getAllRedeemRequests(): Promise<any> {
    try {
      const redeemRrequests =
        await this._requestRedeemRepository.findAllRedeemRequest();
      if (redeemRrequests) {
        return {
          status: true,
          data: redeemRrequests,
          message: "All Redeem Request recieved",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "All Redeem Request Failed to fetch",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message:
          "Error occured while getting all requests - from getAllRedeemRequests/requestService",
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
        message: "Error in changeRequestStatus/requestService",
        error: error,
      };
    }
  }

  async changeRedeemRequestStatus(props: {
    redeemRequestId: string;
    changeTo: string;
  }): Promise<any> {
    try {
      const response = await this._requestRedeemRepository.changeStatus(props);
      if (response) {
        if (props.changeTo == "accepted") {
          const requestData = await this._requestRepository.findByIdAndUpdate(
            response.request_id,
            {
              status: "completed",
            }
          );

          if (requestData) {
            // Calculate the Points
            const calculatedPoints = Math.round(
              2.508 * Math.pow(requestData.reward_amount, 1.0003)
            );

            const sendingTo = process.env.USER_QUEUE;
            const source = "Add the completed request details to the user";
            const props = {
              userId: response?.user_id,
              requestId: requestData?._id.toString(),
              points: calculatedPoints,
            };

            if (!sendingTo) {
              throw new Error("sendingTo is emplty...");
            }

            sendToService({
              sendingTo,
              source,
              props,
            });
          } else {
            console.log(
              "Unable to Change the Request Status and Adding the Points"
            );
          }
        }
        return {
          status: true,
          data: response,
          message: "Redeem Request Status Changed Successfully.",
        };
      } else {
        return {
          status: false,
          data: response,
          message: "Redeeem Request Status Failed to Change.",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "Error in changeRedeemRequestStatus/requestService",
        error: error,
      };
    }
  }
}
