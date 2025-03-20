import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import serviceProxies from "./services";

const app = express();

dotenv.config();

const MAIN_ROUTE = process.env.MAIN_ROUTE;
const PORT = process.env.MAIN_PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;

if (!MAIN_ROUTE || !PORT || !FRONTEND_PORT) {
  console.log(
    "Missing required environment variables. Please check your .env file. From index.ts"
  );
}

app.use(
  cors({
    origin: `http://lostlink.live`,
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.json());

serviceProxies(app);

app.listen(PORT, () => {
  console.log(`Gateway is running on ${MAIN_ROUTE}${PORT}`);
});
