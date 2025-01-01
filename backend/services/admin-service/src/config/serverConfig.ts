import { Express } from "express";

const PORT = process.env.PORT;

export default function serverListening(app: Express) {
  app.listen(PORT, () => {
    console.log(`Admin Service is running on http://localhost:${PORT}`);
  });
}
