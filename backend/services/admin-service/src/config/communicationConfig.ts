import amqp, { Channel, Connection } from "amqplib";

let channel: Channel;
let connection: Connection;

export default async function configCommunication(retries = 5, delayMs = 5000) {
  const AMQP_DEVELOPMENT_HOSTNAME = process.env.AMQP_DEVELOPMENT_HOSTNAME;
  const AMQP_PRODUCTION_HOSTNAME = process.env.AMQP_PRODUCTION_HOSTNAME;
  const ADMIN_QUEUE = process.env.ADMIN_QUEUE;

  if (!AMQP_PRODUCTION_HOSTNAME || !AMQP_DEVELOPMENT_HOSTNAME || !ADMIN_QUEUE) {
    throw new Error(
      "❌ AMQP URL or ADMIN_QUEUE is not defined in environment variables."
    );
  }

  while (retries > 0) {
    try {
      console.log(
        `🔁 Attempting to connect to RabbitMQ (Admin Queue - ${retries} retries left)...`
      );

      connection = await amqp.connect({
        protocol: "amqp",
        hostname:
          process.env.PROJECT_STATUS == "Development"
            ? process.env.AMQP_DEVELOPMENT_HOSTNAME
            : process.env.AMQP_PRODUCTION_HOSTNAME,
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
