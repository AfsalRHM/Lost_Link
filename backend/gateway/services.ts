import { Express } from "express";
import proxy from "express-http-proxy";

export default function serviceProxies(app: Express) {
  const MAIN_ROUTE = process.env.MAIN_ROUTE;
  const AUTH_ROUTE = process.env.AUTH_ROUTE;
  const USER_ROUTE = process.env.USER_ROUTE;
  const REQUEST_ROUTE = process.env.REQUEST_ROUTE;
  const CHAT_ROUTE = process.env.CHAT_ROUTE;
  const NOTIF_ROUTE = process.env.NOTIF_ROUTE;
  const ADMIN_ROUTE = process.env.ADMIN_ROUTE;
  const AUTH_PORT = process.env.AUTH_PORT;
  const USER_PORT = process.env.USER_PORT;
  const ADMIN_PORT = process.env.ADMIN_PORT;
  const CHAT_PORT = process.env.CHAT_PORT;
  const REQUEST_PORT = process.env.REQUEST_PORT;
  const NOTIF_PORT = process.env.NOTIF_PORT;

  if (
    !MAIN_ROUTE ||
    !AUTH_PORT ||
    !USER_PORT ||
    !ADMIN_PORT ||
    !REQUEST_PORT ||
    !CHAT_PORT ||
    !NOTIF_PORT ||
    !AUTH_ROUTE ||
    !USER_ROUTE ||
    !REQUEST_ROUTE ||
    !CHAT_ROUTE ||
    !NOTIF_ROUTE ||
    !ADMIN_ROUTE
  ) {
    console.log(
      "Missing required environment variables. Please check your .env file. From services"
    );
  }

  console.log("AUTH_ROUTE:", AUTH_ROUTE);
  console.log("AUTH_PORT:", AUTH_PORT);
  console.log("Proxying /auth to:", `${AUTH_ROUTE}${AUTH_PORT}`);
  console.log("Proxying /user to:", `${USER_ROUTE}${USER_PORT}`);
  console.log("Proxying /admin to:", `${ADMIN_ROUTE}${ADMIN_PORT}`);
  console.log("Proxying /chat to:", `${CHAT_ROUTE}${CHAT_PORT}`);
  console.log("Proxying /request to:", `$${REQUEST_ROUTE}${REQUEST_PORT}`);
  console.log("Proxying /notif to:", `${NOTIF_ROUTE}${NOTIF_PORT}`);

  app.use("/auth", proxy(`${AUTH_ROUTE}${AUTH_PORT}`));
  app.use("/user", proxy(`${USER_ROUTE}${USER_PORT}`));
  app.use("/admin", proxy(`${ADMIN_ROUTE}${ADMIN_PORT}`));
  app.use("/chat", proxy(`${CHAT_ROUTE}${CHAT_PORT}`));
  app.use("/request", proxy(`${REQUEST_ROUTE}${REQUEST_PORT}`));
  app.use("/notif", proxy(`${NOTIF_ROUTE}${NOTIF_PORT}`));
}
