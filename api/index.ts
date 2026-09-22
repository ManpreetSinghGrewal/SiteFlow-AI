import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import authRoutes from "../server/routes/auth.js";
import profileRoutes from "../server/routes/profiles.js";
import projectRoutes from "../server/routes/projects.js";
import chatRoutes from "../server/routes/chat.js";
import { connectMongo, pingMongo } from "../server/mongodb.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    await pingMongo();
    const db = await connectMongo();
    res.json({ ok: true, database: db.databaseName });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "MongoDB connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/chat", chatRoutes);

// Global Error Handler to catch any unhandled Express errors gracefully
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[SERVER ERROR]", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;
