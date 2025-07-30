import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import bodyParser from "body-parser";
import dbConnection from "./src/config/dbConfig";

const app = express();

dotenv.config();

const CORS_ORIGINS = process.env.CORS_ORIGINS;

if (!CORS_ORIGINS) {
  console.log(
    "Missing required environment variables. Please check your .env file - From Index.ts"
  );
}

app.use(
  cors({
    origin: CORS_ORIGINS?.split(','),
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

dbConnection();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import notification_route from "./src/routes/notificationRoute";
app.use("/", notification_route);

// Setting up the Server
import serverListening from "./src/config/serverConfig";
const server = serverListening(app);

// Initialize Socket.IO
import { initializeSocket } from "./src/socket/socket";
initializeSocket(server);

// Setting Up the Rabbit MQ
import { manageQueue } from "./src/rabbitmq/consumer";
manageQueue();
