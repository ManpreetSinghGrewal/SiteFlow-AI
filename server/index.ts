import "dotenv/config";
import cors from "cors";
import express from "express";
import { closeMongo, connectMongo, pingMongo } from "./mongodb.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profiles.js";
import projectRoutes from "./routes/projects.js";
import chatRoutes from "./routes/chat.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

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

async function ensureIndexes() {
  const db = await connectMongo();
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("profiles").createIndex({ userId: 1 }, { unique: true });
  await db.collection("projects").createIndex({ user_id: 1, created_at: -1 });
}

const server = app.listen(port, async () => {
  try {
    await ensureIndexes();
    console.log(`API server running on http://localhost:${port}`);
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
});

async function shutdown() {
  server.close();
  await closeMongo();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
