import { getChannel } from "../config/communicationConfig";

interface sendToServiceType {
  sendingTo: string;
  correlationId: string;
  source: string;
  correlationIdString: string;
  userId?: string;
}

export default async function sendToService(props: sendToServiceType) {
  try {
    const channel = getChannel();
    const currentQueue = process.env.USER_QUEUE;
    const sendingTo = props.sendingTo;
    const correlationId = props.correlationId;

    if (!sendingTo || !currentQueue) {
      throw new Error("currentQueue is empty");
    }

    // Invoking the queue to take actions
    channel.sendToQueue(sendingTo, Buffer.from(JSON.stringify(props)), {
      replyTo: currentQueue,
      correlationId: correlationId,
      headers: {
        source: props.source,
        correlationIdString: props.correlationIdString,
      },
    });
  } catch (error) {
    console.log(error, "error on the producer");
  }
}
