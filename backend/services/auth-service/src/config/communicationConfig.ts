import amqp, { Channel, Connection } from "amqplib";

let channel: Channel, connection: Connection;

export default async function configCommunication() {
  try {
    const AMQP_URL = process.env.AMQP_URL;
    const AUTH_QUEUE = process.env.AUTH_QUEUE;

    if (!AMQP_URL || !AUTH_QUEUE) {
      throw new Error("Env variables not available");
    }

    async function connect() {
      const amqpServer = AMQP_URL;
      connection = await amqp.connect(amqpServer!);
      channel = await connection.createChannel();
      await channel.assertQueue(AUTH_QUEUE!, { durable: true });
      console.log("Auth Communction Queue is Up....");
    }
    await connect();
  } catch (error) {
    console.log("Auth Communictiono Queue has an error...", error);
  }
}

export const getChannel = (): Channel => channel;
export const getConnection = (): Connection => connection;
