import amqp, { Channel, Connection } from "amqplib";

let channel: Channel, connection: Connection;

export default async function configCommunication() {
  try {
    async function connect() {
      const amqpServer = "amqp://localhost:5672";
      connection = await amqp.connect(amqpServer);
      channel = await connection.createChannel();
      await channel.assertQueue("USER");
      console.log("User Communction Queue is Up....");
    }
    await connect();
  } catch (error) {
    console.log("User Communication Queue is not working", error);
  }
};

export const getChannel = (): Channel => channel;
export const getConnection = (): Connection => connection;
