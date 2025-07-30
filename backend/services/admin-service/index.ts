import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import bodyParser from "body-parser";
import dbConnection from "./src/config/dbConfig";

const app = express();

dotenv.config();

const CORS_ORIGINS = process.env.CORS_ORIGINS;

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

import { manageQueue } from "./src/rabbitmq/consumer";
manageQueue();

import adminRoute from "./src/routes/adminRoute";
app.use("/", adminRoute);

import serverListening from "./src/config/serverConfig";
serverListening(app);

import { startGrpcServer } from "./src/grpc/grpcServer";
startGrpcServer();
