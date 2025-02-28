import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import bodyParser from "body-parser";
import dbConnection from "./src/config/dbConfig";

const app = express();

dotenv.config();

const MAIN_ROUTE = process.env.MAIN_ROUTE;
const FRONTEND_PORT = process.env.FRONTEND_PORT;

app.use(
  cors({
    origin: `${MAIN_ROUTE}${FRONTEND_PORT}`,
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

dbConnection();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import request_route from "./src/routes/requestRoute";
app.use("/", request_route);
import comment_route from "./src/routes/commentRoute";
app.use("/", comment_route);
import report_route from "./src/routes/reportRoute";
app.use("/", report_route);

import serverListening from "./src/config/serverConfig";
serverListening(app);

import { manageQueue } from "./src/rabbitmq/consumer";
manageQueue();
