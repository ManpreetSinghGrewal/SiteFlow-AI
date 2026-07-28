import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { closeMongo, connectMongo, pingMongo } from "./mongodb.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profiles.js";
import projectRoutes from "./routes/projects.js";
import chatRoutes from "./routes/chat.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

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

if (isProduction) {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

async function ensureIndexes() {
  const db = await connectMongo();
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("profiles").createIndex({ userId: 1 }, { unique: true });
  await db.collection("projects").createIndex({ user_id: 1, created_at: -1 });
}

const server = app.listen(port, async () => {
  console.log(`API server running on port ${port}${isProduction ? " (production)" : ""}`);
  try {
    await ensureIndexes();
    console.log("MongoDB database connected & indexes initialized successfully.");
  } catch (error) {
    console.warn("MongoDB connection notice:", error instanceof Error ? error.message : error);
    console.warn("If using MongoDB Atlas, please check that your IP address is whitelisted under Network Access (0.0.0.0/0).");
  }
});

async function shutdown() {
  server.close();
  await closeMongo();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
