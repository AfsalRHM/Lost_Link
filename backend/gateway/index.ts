import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import serviceProxies from "./services";

const app = express();

dotenv.config();

const PORT = process.env.MAIN_PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;

app.use(
  cors({
    origin: `http://localhost:${FRONTEND_PORT}`,
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.json());

serviceProxies(app);

app.listen(PORT, () => {
  console.log(`Gateway is running on http://localhost:${PORT}`);
});
