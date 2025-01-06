import { Express } from "express";

const PORT = process.env.PORT;
const MAIN_ROUTE = process.env.MAIN_ROUTE;

export default function serverListening(app: Express) {
  app.listen(PORT, () => {
    console.log(`User Service is running on ${MAIN_ROUTE}${PORT}`);
  });
}
