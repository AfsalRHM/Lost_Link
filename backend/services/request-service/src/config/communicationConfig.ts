import amqp, { Channel, Connection } from "amqplib";

let channel: Channel;
let connection: Connection;

export default async function configCommunication(retries = 5, delayMs = 5000) {
  const AMQP_DEVELOPMENT_HOSTNAME = process.env.AMQP_DEVELOPMENT_HOSTNAME;
  const AMQP_PRODUCTION_HOSTNAME = process.env.AMQP_PRODUCTION_HOSTNAME;
  const REQUEST_QUEUE = process.env.REQUEST_QUEUE;

  if (
    !AMQP_PRODUCTION_HOSTNAME ||
    !AMQP_DEVELOPMENT_HOSTNAME ||
    !REQUEST_QUEUE
  ) {
    throw new Error(
      "❌ AMQP URL or REQUEST_QUEUE is not defined in environment variables."
    );
  }

  while (retries > 0) {
    try {
      console.log(
        `🔁 Attempting to connect to RabbitMQ (Request Queue - ${retries} retries left)...`
      );

      // ✅ connection gets the output of amqp.connect (type: Connection)
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

      // ✅ channel is created from connection
      channel = await connection.createChannel();
      await channel.assertQueue(REQUEST_QUEUE, { durable: true });

      console.log("✅ Request Communication Queue is up and running.");
      break;
    } catch (error) {
      console.error("❌ RabbitMQ connection (Request Queue) failed:", error);
      retries--;
      if (retries === 0) {
        throw new Error("❌ All retry attempts failed for Request Queue.");
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

// ✅ Fully type-safe exports
export const getChannel = (): Channel => channel;
export const getConnection = (): Connection => connection;
