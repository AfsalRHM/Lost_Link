import { Express } from "express";
import proxy from "express-http-proxy";

export default function serviceProxies(app: Express) {
  const MAIN_ROUTE = process.env.MAIN_ROUTE;
  const AUTH_PORT = process.env.AUTH_PORT;
  const USER_PORT = process.env.USER_PORT;
  const ADMIN_PORT = process.env.ADMIN_PORT;

  if (!MAIN_ROUTE || !AUTH_PORT || !USER_PORT || !ADMIN_PORT) {
    console.log(
      "Missing required environment variables. Please check your .env file. From services"
    );
  }

  app.use("/auth", proxy(`${MAIN_ROUTE}${AUTH_PORT}`));
  app.use("/user", proxy(`${MAIN_ROUTE}${USER_PORT}`));
  app.use("/admin", proxy(`${MAIN_ROUTE}${ADMIN_PORT}`));
}
