import IcommentService from "../interface/IcommentService";
import sendToService from "../rabbitmq/producer";
import commentRepository from "../repositories/commentRepository";
import { createCorrelationId } from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";

export default class commentService implements IcommentService {
  private _commentRepository: commentRepository;

  constructor() {
    this._commentRepository = new commentRepository();
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
        return {
          status: false,
          data: null,
          message: "Data not reached on createComment/commentService",
        };
      }

      const comment = {
        request_id: requestId,
        user_id: userId,
        content: commentText,
      };

      const commentData = await this._commentRepository.insert(comment);

      const sendingTo = process.env.USER_QUEUE;
      const correlationId = createCorrelationId(userId);
      const source = "get user data by userId";
      const props = {
        userId,
      };

      if (!sendingTo) {
        throw new Error("sendingTo is emplty...");
      }

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

      const newCommentData = {
        ...commentData.toObject(),
        user_id: {
          _id: userDataResponse.data._doc._id,
          name: userDataResponse.data._doc.user_name,
          profilePicture: userDataResponse.data._doc.profile_pic,
        },
      };

      if (newCommentData) {
        return {
          status: true,
          data: newCommentData,
          message: "New comment Created",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Failed to create new Comment",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message: "Error on createComment/commentService",
      };
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
        return {
          status: false,
          data: null,
          message: "Data not reached on getRequestComments/commentService",
        };
      }

      const allRequestComments = await this._commentRepository.findAll({
        request_id: requestId,
      });
      const totalCommentLength = allRequestComments.length;

      const commentDatas = await this._commentRepository.findComments({
        request_id1: requestId,
        commentCount,
      });

      if (!commentDatas) {
        return {
          status: true,
          data: [],
          message: "Comments is Empty",
        };
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
        throw new Error("sendingTo is emplty...");
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

      const userMap =
        userDatas?.reduce((acc: any, user: any) => {
          acc[user._id] = {
            _id: user._id,
            name: user.user_name,
            profilePicture: user.profile_pic,
          };
          return acc;
        }, {}) || {};

      const newCommentDatas = commentDatas.map((comment) => ({
        ...comment.toObject(),
        user_id: userMap[comment.user_id],
      }));

      if (newCommentDatas) {
        return {
          status: true,
          data: { newCommentDatas, totalCommentLength },
          message: "All Comment Successfully Fetched",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Failed to Fetch the Comments",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message: "Error on getRequestComments/commentService",
      };
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
