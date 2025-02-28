import IreportService from "../interface/IreportService";
import reportRepository from "../repositories/reportRepository";

export default class reportService implements IreportService {
  private _reportRepository: reportRepository;

  constructor() {
    this._reportRepository = new reportRepository();
  }

  async createReport({
    requestId,
    reportReason,
    userId,
  }: {
    requestId: string;
    reportReason: string;
    userId: string;
  }): Promise<any> {
    try {
      if (!requestId || !reportReason || !userId) {
        return {
          status: false,
          data: null,
          message: "Data not reached on createReport/reportService",
        };
      }

      const report = {
        request_id: requestId,
        user_id: userId,
        reason: reportReason,
      };

      const reportData = await this._reportRepository.insert(report);

      if (reportData) {
        return {
          status: true,
          data: reportData,
          message: "New Report Created",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Failed to create new Report",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message: "Error on createReport/reportService",
      };
    }
  }

  // To get all the comments of a request
  //   async getRequestReports({
  //     requestId,
  //     commentCount,
  //   }: {
  //     requestId: string;
  //     commentCount: number;
  //   }): Promise<any> {
  //     try {
  //       if (!requestId) {
  //         return {
  //           status: false,
  //           data: null,
  //           message: "Data not reached on getRequestComments/commentService",
  //         };
  //       }

  //       const allRequestComments = await this._reportRepository.findAll({
  //         request_id: requestId,
  //       });
  //       const totalCommentLength = allRequestComments.length;

  //       const commentDatas = await this._reportRepository.findComments({
  //         request_id1: requestId,
  //         commentCount,
  //       });

  //       if (!commentDatas) {
  //         return {
  //           status: true,
  //           data: [],
  //           message: "Comments is Empty",
  //         };
  //       }

  //       const userIds = [
  //         ...new Set(commentDatas.map((comment) => comment.user_id)),
  //       ];

  //       const sendingTo = process.env.USER_QUEUE;
  //       const correlationId = createCorrelationId(requestId);
  //       const source = "get user's data by userId";
  //       const props = {
  //         userIds,
  //       };

  //       if (!sendingTo) {
  //         throw new Error("sendingTo is emplty...");
  //       }

  //       sendToService({
  //         sendingTo,
  //         source,
  //         correlationId: correlationId,
  //         props,
  //       });

  //       const userDatas: any = await new Promise((resolve, reject) => {
  //         const timeout = setTimeout(() => {
  //           reject(new Error("Response timeout"));
  //         }, 10000);

  //         eventEmitter.once(correlationId, (data) => {
  //           clearTimeout(timeout);
  //           resolve(data);
  //         });
  //       });

  //       const userMap =
  //         userDatas?.reduce((acc: any, user: any) => {
  //           acc[user._id] = {
  //             _id: user._id,
  //             name: user.user_name,
  //             profilePicture: user.profile_pic,
  //           };
  //           return acc;
  //         }, {}) || {};

  //       const newCommentDatas = commentDatas.map((comment) => ({
  //         ...comment.toObject(),
  //         user_id: userMap[comment.user_id],
  //       }));

  //       if (newCommentDatas) {
  //         return {
  //           status: true,
  //           data: { newCommentDatas, totalCommentLength },
  //           message: "All Comment Successfully Fetched",
  //         };
  //       } else {
  //         return {
  //           status: false,
  //           data: null,
  //           message: "Failed to Fetch the Comments",
  //         };
  //       }
  //     } catch (error) {
  //       return {
  //         status: false,
  //         data: null,
  //         message: "Error on getRequestComments/commentService",
  //       };
  //     }
  //   }
}

// // to access the userDetails from the queue after comment creation
// export function getUserDataByUserId(correlationId: string, params: any) {
//   eventEmitter.emit(correlationId, params);
// }

// // to access the userDetails for all the user ids for comments load
// export function getUsersDataByUserId(correlationId: string, params: any) {
//   eventEmitter.emit(correlationId, params);
// }
