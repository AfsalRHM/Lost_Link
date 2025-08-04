import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import dbConnection from "./src/config/dbConfig";
import request_route from "./src/routes/requestRoute";
import comment_route from "./src/routes/commentRoute";
import report_route from "./src/routes/reportRoute";
import { globalErrorHandler } from "./src/middlewares/errorHandler";
import serverListening from "./src/config/serverConfig";
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

app.use("/", request_route);
app.use("/", comment_route);
app.use("/", report_route);
app.use(globalErrorHandler);

serverListening(app);
manageQueue();
