import IchatService from "../interface/IchatService";
import chatRepository from "../repositories/chatRepository";
import jwtFunctions from "../utils/jwt";

// import {
//   clearCorrelationId,
//   createCorrelationId,
// } from "../utils/correlationId";
// import eventEmitter from "../utils/eventEmitter";
// import sendToService from "../rabbitmq/producer";
import jwtPayload from "../interface/IjwtPayload";

export default class chatService implements IchatService {
  private _chatRepository: chatRepository;

  constructor() {
    this._chatRepository = new chatRepository();
  }

  // Function to check the user already exists or not
  async getUserChat(recieverEmail: string): Promise<any> {
    try {
      const replyQueue = process.env.USER_QUEUE;
      //   const correlationId = createCorrelationId(recieverEmail);

      //   if (!replyQueue) {
      //     throw new Error("replyQueue is empty...!");
      //   }

      //   sendToService({
      //     sendingTo: replyQueue,
      //     correlationId: correlationId,
      //     source: "user mail duplication request",
      //     userMail: recieverEmail,
      //   });

      //   const userData: any = await new Promise((resolve, reject) => {
      //     const timeout = setTimeout(() => {
      //       reject(new Error("Response timeout"));
      //     }, 10000);

      //     eventEmitter.once(correlationId, (data) => {
      //       clearTimeout(timeout);
      //       resolve(data);
      //     });
      //   });

      const userData = {
        data: "fjsdf",
        message: "jdfhskdjfs"
      };

      if (userData.data) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error, "error on the checkMail/authService");
      return false;
    }
  }
}

// to access the userDetails from the queue after registration
// export function userDetails(correlationId: string, params: any) {
//   eventEmitter.emit(correlationId, params);
// }
