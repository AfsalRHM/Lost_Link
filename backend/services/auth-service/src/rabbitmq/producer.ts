import { getChannel } from "../config/communicationConfig";
import { UserFormDataType } from "../interface/IauthService";

interface sendToServiceType {
  sendingTo: string;
  correlationId: string;
  source: string;
  correlationIdString?: string;
  userId?: string;
  userMail?: string;
  newPassword?: string;
  userData?: UserFormDataType;
}

export default async function sendToService(props: sendToServiceType) {
  try {
    const channel = getChannel();
    const currentQueue = process.env.AUTH_QUEUE;
    const sendingTo = props.sendingTo;
    const correlationId = props.correlationId;

    if (!sendingTo || !currentQueue) {
      throw new Error("currentQueue is empty");
    }

    let content: Record<string, string | undefined> = {};

    if (props.userId) {
      content.userId = props.userId;
    }
    if (props.userMail) {
      content.userMail = props.userMail;
    }
    if (props.newPassword) {
      content.newPassword = props.newPassword;
    }
    if (props.userData) {
      content = { ...props.userData };
    }

    const headers: Record<string, string | undefined> = {
      source: props.source,
    };

    if (props.correlationIdString) {
      headers.correlationIdString = props.correlationIdString;
    }

    // Invoking the queue to take actions
    channel.sendToQueue(sendingTo, Buffer.from(JSON.stringify(content)), {
      replyTo: currentQueue,
      correlationId: correlationId,
      headers,
    });
  } catch (error) {
    console.log(error, "error on the producer");
  }
}
