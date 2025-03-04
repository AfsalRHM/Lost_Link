import amqp, { Channel, Connection } from "amqplib";

let channel: Channel, connection: Connection;

export default async function configCommunication() {
  try {
    const AMQP_URL = process.env.AMQP_URL;
    const NOTIF_QUEUE = process.env.NOTIF_QUEUE;

    if (!AMQP_URL || !NOTIF_QUEUE) {
      throw new Error("Env variables not available");
    }

    async function connect() {
      const amqpServer = AMQP_URL;
      connection = await amqp.connect(amqpServer!);
      channel = await connection.createChannel();
      await channel.assertQueue(NOTIF_QUEUE!);
      console.log("Notification Communction Queue is Up....");
    }
    await connect();
  } catch (error) {
    console.log("Notification Communication Queue is not working", error);
  }
}

export const getChannel = (): Channel => channel;
export const getConnection = (): Connection => connection;
