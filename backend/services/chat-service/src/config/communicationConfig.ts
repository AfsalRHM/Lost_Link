import amqp, { Channel, Connection } from "amqplib";

let channel: Channel, connection: Connection;

export default async function configCommunication() {
  try {
    const AMQP_URL = process.env.AMQP_URL;
    const CHAT_QUEUE = process.env.CHAT_QUEUE;

    if (!AMQP_URL || !CHAT_QUEUE) {
      throw new Error("Env variables not available");
    }

    async function connect() {
      const amqpServer = AMQP_URL;
      connection = await amqp.connect(amqpServer!);
      channel = await connection.createChannel();
      await channel.assertQueue(CHAT_QUEUE!);
      console.log("Chat Communction Queue is Up....");
    }
    await connect();
  } catch (error) {
    console.log("Chat Communication Queue is not working", error);
  }
}

export const getChannel = (): Channel => channel;
export const getConnection = (): Connection => connection;
