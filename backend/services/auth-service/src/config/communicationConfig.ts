import amqp, { Channel, Connection } from "amqplib";

let channel: Channel, connection: Connection;

export default async function configCommunication() {
  try {
    async function connect() {
      const amqpServer = "amqp://localhost:5672";
      connection = await amqp.connect(amqpServer);
      channel = await connection.createChannel();
      await channel.assertQueue("AUTH", {durable: true});
      console.log("Auth Communction Queue is Up....");
    }
    await connect();
  } catch (error) {
    console.log("Auth Communictiono Queue has an error...", error);
  }
}

export const getChannel = (): Channel => channel;
export const getConnection = (): Connection => connection;
