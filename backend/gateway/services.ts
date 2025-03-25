import { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

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

  // Proxy Configuration
  app.use(
    "/auth",
    createProxyMiddleware({
      target: `${AUTH_ROUTE}${AUTH_PORT}`,
      changeOrigin: true,
    })
  );

  app.use(
    "/user",
    createProxyMiddleware({
      target: `${USER_ROUTE}${USER_PORT}`,
      changeOrigin: true,
    })
  );

  app.use(
    "/admin",
    createProxyMiddleware({
      target: `${ADMIN_ROUTE}${ADMIN_PORT}`,
      changeOrigin: true,
    })
  );

  app.use(
    "/chat",
    createProxyMiddleware({
      target: `${CHAT_ROUTE}${CHAT_PORT}`,
      changeOrigin: true,
      ws: true, // enable WebSocket proxy
      pathRewrite: {
        "^/chat": "/", // remove /chat prefix
      },
    })
  );

  app.use(
    "/notif",
    createProxyMiddleware({
      target: `${NOTIF_ROUTE}${NOTIF_PORT}`,
      changeOrigin: true,
      ws: true, // enable WebSocket proxy
      pathRewrite: {
        "^/notif": "/", // remove /notif prefix
      },
    })
  );

  app.use(
    "/request",
    createProxyMiddleware({
      target: `${REQUEST_ROUTE}${REQUEST_PORT}`,
      changeOrigin: true,
    })
  );

  console.log("Proxy routes initialized.");
}
