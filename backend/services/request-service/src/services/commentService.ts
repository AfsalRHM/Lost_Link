import IcommentService from "../interface/IcommentService";
import { IcommentRepository } from "../interface/IcommentRepository";

import sendToService from "../rabbitmq/producer";
import { StatusCode } from "../constants/statusCodes";
import mergeUserAndComment from "../helpers/mergeUserAndComment";

import { createCorrelationId } from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";
import { AppError } from "../utils/appError";
import { handleServiceError } from "../utils/errorHandler";

export default class CommentService implements IcommentService {
  private _commentRepository: IcommentRepository;

  constructor(commentRepository: IcommentRepository) {
    this._commentRepository = commentRepository;
  }

  async createComment({
    requestId,
    commentText,
    userId,
  }: {
    requestId: string;
    commentText: string;
    userId: string;
  }): Promise<any> {
    try {
      if (!requestId || !commentText || !userId) {
        throw new AppError(
          "requestId, commentText and userId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const sendingTo = process.env.USER_QUEUE;
      if (!sendingTo) {
        throw new Error("sendigTo env is not accessible, from comment service");
      }

      const correlationId = createCorrelationId(userId);
      const source = "get user data by userId";
      const props = {
        userId,
      };

      sendToService({
        sendingTo,
        source,
        correlationId: correlationId,
        props,
      });

      const userDataResponse: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });

      const comment = {
        request_id: requestId,
        user_id: userId,
        user_info: {
          user_name: userDataResponse.data.userName,
          profile_pic: userDataResponse.data.profilePic,
        },
        content: commentText,
      };

      const commentData = await this._commentRepository.insertComment(comment);
      if (!commentData) {
        throw new AppError(
          "Failed to create comment",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return commentData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while creating comment");
    }
  }

  // To get all the comments of a request
  async getRequestComments({
    requestId,
    commentCount,
  }: {
    requestId: string;
    commentCount: number;
  }): Promise<any> {
    try {
      if (!requestId) {
        throw new AppError("requestId is required");
      }

      const allRequestComments = await this._commentRepository.findMany({
        request_id: requestId,
      });
      const totalCommentLength = allRequestComments.length;

      const commentDatas = await this._commentRepository.findComments({
        request_id1: requestId,
        commentCount,
      });
      if (!commentDatas) {
        throw new AppError("Comment is empty", StatusCode.NO_CONTENT);
      }

      const userIds = [
        ...new Set(commentDatas.map((comment) => comment.user_id)),
      ];

      const sendingTo = process.env.USER_QUEUE;
      const correlationId = createCorrelationId(requestId);
      const source = "get user's data by userId";
      const props = {
        userIds,
      };

      if (!sendingTo) {
        throw new Error("sendigTo env is not accessible, from comment service");
      }

      sendToService({
        sendingTo,
        source,
        correlationId: correlationId,
        props,
      });

      const userDatas: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });

      const newCommentDatas = mergeUserAndComment({ userDatas, commentDatas });

      return { newCommentDatas, totalCommentLength };
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching request comments"
      );
    }
  }
}

// to access the userDetails from the queue after comment creation
export function getUserDataByUserId(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}

// to access the userDetails for all the user ids for comments load
export function getUsersDataByUserId(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
