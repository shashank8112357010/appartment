import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/connection";
import { handleDemo } from "./routes/demo";
import { dataExRouter } from "./routes/dataEx";

export async function createServer() {
  // Connect to MongoDB
  await connectDB();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api', dataExRouter);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
