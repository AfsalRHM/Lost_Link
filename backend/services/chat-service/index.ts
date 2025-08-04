import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import dbConnection from "./src/config/dbConfig";
import chat_route from "./src/routes/chatRoute";
import message_route from "./src/routes/messageRoute";
import meet_route from "./src/routes/meetRoute";
import { globalErrorHandler } from "./src/middlewares/errorHandler";
import serverListening from "./src/config/serverConfig";
import { initializeSocket } from "./src/socket/socket";
import { manageQueue } from "./src/rabbitmq/consumer";

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
    origin: CORS_ORIGINS?.split(","),
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

dbConnection();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", chat_route);
app.use("/", message_route);
app.use("/", meet_route);
app.use(globalErrorHandler);

const server = serverListening(app);
initializeSocket(server);
manageQueue();
