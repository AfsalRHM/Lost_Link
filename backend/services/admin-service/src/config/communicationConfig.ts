import amqp, { Channel, Connection } from "amqplib";

let channel: Channel;
let connection: Connection;

export default async function configCommunication(retries = 5, delayMs = 5000) {
  const AMQP_URL = process.env.AMQP_URL;
  const ADMIN_QUEUE = process.env.ADMIN_QUEUE;

  if (!AMQP_URL || !ADMIN_QUEUE) {
    throw new Error(
      "❌ AMQP_URL or ADMIN_QUEUE is not defined in environment variables."
    );
  }

  while (retries > 0) {
    try {
      console.log(
        `🔁 Attempting to connect to RabbitMQ (Admin Queue - ${retries} retries left)...`
      );

      connection = await amqp.connect({
        protocol: "amqp",
        hostname: "rabbitmq",
        port: 5672,
        username: "guest",
        password: "guest",
        frameMax: 8192,
      });

      channel = await connection.createChannel();
      await channel.assertQueue(ADMIN_QUEUE, { durable: true });

      console.log("✅ Admin Communication Queue is up and running.");
      break;
    } catch (error) {
      console.error("❌ RabbitMQ connection (Admin Queue) failed:", error);
      retries--;
      if (retries === 0) {
        console.error("❌ All retry attempts failed for Admin Queue.");
        throw new Error(
          "Could not connect to RabbitMQ after multiple attempts."
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export const getChannel = (): Channel => channel;
export const getConnection = (): Connection => connection;
