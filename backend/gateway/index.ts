import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import serviceProxies from "./services";

const app = express();

dotenv.config();

const PORT = process.env.MAIN_PORT;

const MAIN_ROUTE = process.env.MAIN_ROUTE;
const CORS_ORIGINS = process.env.CORS_ORIGINS;

if (!MAIN_ROUTE || !PORT || !CORS_ORIGINS) {
  console.log(
    "Missing required environment variables. Please check your .env file - From Index.ts"
  );
}

app.use(
  cors({
    origin: CORS_ORIGINS!.split(","),
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.json());

serviceProxies(app);

app.listen(PORT, () => {
  console.log(`Gateway is running on ${MAIN_ROUTE}${PORT}`);
});
