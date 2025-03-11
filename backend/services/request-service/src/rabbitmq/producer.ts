import { getChannel } from "../config/communicationConfig";

interface sendToServiceType {
  sendingTo: string;
  correlationId?: string;
  source: string;
  correlationIdIdentifier?: string;
  props?: {
    userId?: string;
    userIds?: string[];
    token?: string;
    adminId?: string;
    email?: string;
    role?: string;
    requestId?: string;
    response?: any
    rewardAmount?: number
  };
}

export default async function sendToService(props: sendToServiceType) {
  try {
    const channel = getChannel();
    const currentQueue = process.env.REQUEST_QUEUE;
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
        correlationIdIdentifier: props.correlationIdIdentifier,
      },
    });
  } catch (error) {
    console.log(error, "error on the producer");
  }
}
