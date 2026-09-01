import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { connectMongo } from "../mongodb.js";
import { requireAuth, signToken } from "../middleware/auth.js";
import { toIso } from "../serialize.js";
import { sendBrevoEmail, getWelcomeEmailHtml, getResetPasswordEmailHtml } from "../brevo.js";
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
  const name = displayName?.trim() || normalizedEmail.split("@")[0];

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
    display_name: name,
    business_name: null,
    created_at: now,
    updated_at: now,
  });

  const token = signToken(userId);

  // Send Brevo Welcome Email asynchronously
  sendBrevoEmail({
    to: [{ email: normalizedEmail, name }],
    subject: "Welcome to SiteFlow AI! 🚀",
    htmlContent: getWelcomeEmailHtml(name),
  }).catch((err) => console.error("Welcome email error:", err));

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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ error: "Email address is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = await connectMongo();
  const user = await db.collection<UserDoc>("users").findOne({ email: normalizedEmail });

  if (!user) {
    // For security, respond success even if email not found
    return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiration

  await db.collection("password_resets").updateOne(
    { userId: user._id },
    {
      $set: {
        userId: user._id,
        email: normalizedEmail,
        token: resetToken,
        expiresAt,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  const resetUrl = `https://site-flow-ai-eight.vercel.app/reset-password?token=${resetToken}`;

  const sent = await sendBrevoEmail({
    to: [{ email: normalizedEmail }],
    subject: "Reset your SiteFlow AI password 🔑",
    htmlContent: getResetPasswordEmailHtml(resetUrl),
  });

  if (!sent && !process.env.BREVO_API_KEY) {
    return res.status(400).json({
      error: "BREVO_API_KEY is not configured on the server. Please contact support or check server environment.",
    });
  }

  res.json({ message: "If an account with that email exists, a password reset link has been sent." });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body as { token?: string; newPassword?: string };

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Reset token and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const db = await connectMongo();
  const resetRecord = await db.collection("password_resets").findOne({ token });

  if (!resetRecord || new Date(resetRecord.expiresAt) < new Date()) {
    return res.status(400).json({ error: "Invalid or expired password reset token" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.collection<UserDoc>("users").updateOne(
    { _id: resetRecord.userId },
    { $set: { passwordHash, updatedAt: new Date() } }
  );

  await db.collection("password_resets").deleteOne({ token });

  res.json({ message: "Password updated successfully! You can now log in with your new password." });
});

export default router;
