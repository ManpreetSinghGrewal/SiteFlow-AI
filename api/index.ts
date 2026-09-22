import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import authRoutes from "../server/routes/auth";
import profileRoutes from "../server/routes/profiles";
import projectRoutes from "../server/routes/projects";
import chatRoutes from "../server/routes/chat";
import { connectMongo, pingMongo } from "../server/mongodb";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health Check Endpoints
const healthHandler = async (_req: Request, res: Response) => {
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
};

app.get("/api/health", healthHandler);
app.get("/health", healthHandler);

// Mount API Routes with dual prefix for Vercel rewrites compatibility
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/profiles", profileRoutes);
app.use("/profiles", profileRoutes);

app.use("/api/projects", projectRoutes);
app.use("/projects", projectRoutes);

app.use("/api/chat", chatRoutes);
app.use("/chat", chatRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[EXPRESS SERVER ERROR]", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
