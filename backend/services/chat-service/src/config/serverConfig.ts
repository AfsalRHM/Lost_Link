import http from "http";
import { Express } from "express";

const PORT = process.env.PORT;
const MAIN_ROUTE = process.env.MAIN_ROUTE;

export default function serverListening(app: Express) {
  // Create HTTP server from Express app to configure the socket.io
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Chat Service is running on ${MAIN_ROUTE}${PORT}`);
  });

  return server;
}
