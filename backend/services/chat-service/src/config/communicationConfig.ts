import amqp, { Channel, Connection } from "amqplib";

let channel: Channel;
let connection: Connection;

export default async function configCommunication(retries = 5, delayMs = 5000) {
  const AMQP_HOSTNAME_DEV = process.env.AMQP_HOSTNAME_DEV;
  const AMQP_HOSTNAME = process.env.AMQP_HOSTNAME;
  const CHAT_QUEUE = process.env.CHAT_QUEUE;

  if (!AMQP_HOSTNAME_DEV || !AMQP_HOSTNAME || !CHAT_QUEUE) {
    throw new Error(
      "❌ AMQP URL or CHAT_QUEUE is not defined in environment variables."
    );
  }

  while (retries > 0) {
    try {
      console.log(
        `🔁 Attempting to connect to RabbitMQ (Chat Queue - ${retries} retries left)...`
      );

      connection = await amqp.connect({
        protocol: "amqp",
        hostname:
          process.env.NODE_ENV == "Development"
            ? AMQP_HOSTNAME_DEV
            : AMQP_HOSTNAME,
        port: 5672,
        username: "guest",
        password: "guest",
        frameMax: 8192,
      });

      channel = await connection.createChannel();
      await channel.assertQueue(CHAT_QUEUE, { durable: true });

      console.log("✅ Chat Communication Queue is up and running.");
      break;
    } catch (error) {
      console.error("❌ RabbitMQ connection (Chat Queue) failed:", error);
      retries--;
      if (retries === 0) {
        console.error("❌ All retry attempts failed for Chat Queue.");
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
