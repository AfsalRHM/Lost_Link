import { Express } from "express";
import proxy from "express-http-proxy";

export default function serviceProxies(app: Express) {
  app.use("/auth", proxy(`http://localhost:${process.env.AUTH_PORT}`));
  app.use("/user", proxy(`http://localhost:${process.env.USER_PORT}`));
}
