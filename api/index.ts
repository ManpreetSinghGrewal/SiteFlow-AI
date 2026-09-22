import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Dynamic safe route loaders
app.use("/api/auth", async (req, res, next) => {
  try {
    const mod = await import("../server/routes/auth");
    return mod.default(req, res, next);
  } catch (err: any) {
    console.error("Auth module load error:", err);
    return res.status(500).json({ error: "Auth module load failed: " + (err?.message || String(err)) });
  }
});

app.use("/api/profiles", async (req, res, next) => {
  try {
    const mod = await import("../server/routes/profiles");
    return mod.default(req, res, next);
  } catch (err: any) {
    console.error("Profiles module load error:", err);
    return res.status(500).json({ error: "Profiles module load failed: " + (err?.message || String(err)) });
  }
});

app.use("/api/projects", async (req, res, next) => {
  try {
    const mod = await import("../server/routes/projects");
    return mod.default(req, res, next);
  } catch (err: any) {
    console.error("Projects module load error:", err);
    return res.status(500).json({ error: "Projects module load failed: " + (err?.message || String(err)) });
  }
});

app.use("/api/chat", async (req, res, next) => {
  try {
    const mod = await import("../server/routes/chat");
    return mod.default(req, res, next);
  } catch (err: any) {
    console.error("Chat module load error:", err);
    return res.status(500).json({ error: "Chat module load failed: " + (err?.message || String(err)) });
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    const { connectMongo, pingMongo } = await import("../server/mongodb");
    await pingMongo();
    const db = await connectMongo();
    res.json({ ok: true, database: db.databaseName });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      error: error?.message || "MongoDB connection failed",
    });
  }
});

export default app;
