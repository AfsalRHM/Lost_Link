import { getChannel } from "../config/communicationConfig";
import { UserFormDataType } from "../interface/IauthService";

interface sendToServiceType {
  sendingTo: string;
  correlationId: string;
  source: string;
  correlationIdentifier?: string;
  props?: {
    userId?: string;
    userMail?: string;
    newPassword?: string;
    userData?: UserFormDataType;
  };
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

    // Invoking the queue to take actions
    channel.sendToQueue(sendingTo, Buffer.from(JSON.stringify(props.props)), {
      replyTo: currentQueue,
      correlationId: correlationId,
      headers: {
        source: props.source,
        correlationIdentifier: props.correlationIdentifier,
      },
    });
  } catch (error) {
    console.log(error, "error on the producer");
  }
}
