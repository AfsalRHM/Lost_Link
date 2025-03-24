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
    origin: ["https://lostlink.live", "https://www.lostlink.live"],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

dbConnection();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import { manageQueue } from "./src/rabbitmq/consumer";
manageQueue();

import authRoute from "./src/routes/authRoute";
app.use("/", authRoute);

import serverListening from "./src/config/serverConfig";
serverListening(app);
