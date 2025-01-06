import amqp, { Channel, Connection } from "amqplib";

let channel: Channel, connection: Connection;

export default async function configCommunication() {
  try {
    const AMQP_URL = process.env.AMQP_URL;
    const ADMIN_QUEUE = process.env.ADMIN_QUEUE;

    if (!AMQP_URL) {
      throw new Error("AMQP_URL is not defined in environment variables.");
    }
    if (!ADMIN_QUEUE) {
      throw new Error("ADMIN_QUEUE is not defined in environment variables.");
    }

    async function connect() {
      const amqpServer = AMQP_URL!;
      connection = await amqp.connect(amqpServer);
      channel = await connection.createChannel();
      await channel.assertQueue(ADMIN_QUEUE!, { durable: true });
      console.log("Admin Communction Queue is Up....");
    }
    await connect();
  } catch (error) {
    console.log("Admin Communictiono Queue has an error...", error);
  }
}

export const getChannel = (): Channel => channel;
export const getConnection = (): Connection => connection;
