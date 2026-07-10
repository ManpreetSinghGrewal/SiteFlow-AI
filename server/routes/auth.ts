import { Router } from "express";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { connectMongo } from "../mongodb.js";
import { requireAuth, signToken } from "../middleware/auth.js";
import { toIso } from "../serialize.js";
import type { AuthRequest } from "../middleware/auth.js";
import type { ProfileDoc, UserDoc } from "../types.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const { email, password, displayName } = req.body as {
    email?: string;
    password?: string;
    displayName?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = await connectMongo();
  const users = db.collection<UserDoc>("users");

  const existing = await users.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const now = new Date();
  const userId = new ObjectId();
  const passwordHash = await bcrypt.hash(password, 12);

  await users.insertOne({
    _id: userId,
    email: normalizedEmail,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  const profiles = db.collection<ProfileDoc>("profiles");
  await profiles.insertOne({
    _id: userId,
    userId,
    display_name: displayName?.trim() || normalizedEmail.split("@")[0],
    business_name: null,
    created_at: now,
    updated_at: now,
  });

  const token = signToken(userId);

  res.status(201).json({
    token,
    user: {
      id: userId.toString(),
      email: normalizedEmail,
      created_at: toIso(now),
    },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const db = await connectMongo();
  const user = await db.collection<UserDoc>("users").findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken(user._id);

  res.json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      created_at: toIso(user.createdAt),
    },
  });
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = req.user!;
  res.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      created_at: toIso(user.createdAt),
    },
  });
});

router.post("/forgot-password", (_req, res) => {
  res.status(501).json({
    error: "Password reset requires email configuration. Contact your administrator.",
  });
});

export default router;
