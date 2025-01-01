import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import bodyParser from "body-parser";
import dbConnection from "./src/config/dbConfig";

const app = express();

dotenv.config();

dbConnection();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import { manageQueue } from "./src/utils/managingQueue";
manageQueue();

import adminRoute from "./src/routes/adminRoute";
app.use("/", adminRoute);

import serverListening from "./src/config/serverConfig";
serverListening(app);
