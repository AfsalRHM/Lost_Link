import { Express } from "express";

export default function serverListening(app: Express) {
  const PORT = process.env.PORT;
  const MAIN_ROUTE = process.env.MAIN_ROUTE;

  if (!PORT || !MAIN_ROUTE) {
    console.log("ENV not configure on admin-service/config/serverConfig");
  }

  app.listen(PORT, () => {
    console.log(`Admin Service is running on ${MAIN_ROUTE}${PORT}`);
  });
}
