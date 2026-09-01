import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { connectMongo } from "../mongodb.js";
import { requireAuth, signToken } from "../middleware/auth.js";
import { toIso } from "../serialize.js";
import { sendBrevoEmail, getWelcomeEmailHtml, getResetPasswordEmailHtml, getOtpEmailHtml } from "../brevo.js";
import type { AuthRequest } from "../middleware/auth.js";
import type { ProfileDoc, UserDoc } from "../types.js";

const router = Router();

/**
 * SIGNUP CONTROLLER
 * Registers new user with isVerified = false and dispatches Brevo 6-digit OTP code
 */
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
  if (existing && existing.isVerified !== false) {
    return res.status(409).json({ error: "An account with this email already exists. Please log in." });
  }

  const now = new Date();
  const userId = existing ? existing._id : new ObjectId();
  const passwordHash = await bcrypt.hash(password, 12);
  const name = displayName?.trim() || normalizedEmail.split("@")[0];

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  if (existing) {
    await users.updateOne(
      { _id: userId },
      {
        $set: {
          passwordHash,
          isVerified: false,
          verificationCode: otp,
          verificationExpiresAt: expiresAt,
          updatedAt: now,
        },
      }
    );
  } else {
    await users.insertOne({
      _id: userId,
      email: normalizedEmail,
      passwordHash,
      isVerified: false,
      verificationCode: otp,
      verificationExpiresAt: expiresAt,
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
  }

  // Dispatch Brevo OTP email via HTTPS REST API
  sendBrevoEmail({
    to: [{ email: normalizedEmail, name }],
    subject: `Your SiteFlow AI Verification Code: ${otp} 🔐`,
    htmlContent: getOtpEmailHtml(otp),
  }).catch((err) => console.error("Brevo OTP dispatch error:", err));

  res.status(201).json({
    ok: true,
    message: "Verification code sent to your email!",
    email: normalizedEmail,
  });
});

/**
 * VERIFY EMAIL CONTROLLER
 * Validates 6-digit OTP, marks account isVerified = true, sends Welcome email & returns JWT token
 */
router.post("/verify-email", async (req, res) => {
  const { email, otp } = req.body as { email?: string; otp?: string };

  if (!email || !otp) {
    return res.status(400).json({ error: "Email address and 6-digit OTP code are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();
  const db = await connectMongo();
  const users = db.collection<UserDoc>("users");

  const user = await users.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(404).json({ error: "User account not found. Please sign up." });
  }

  if (user.isVerified) {
    // Already verified - generate token
    const token = signToken(user._id);
    return res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        created_at: toIso(user.createdAt),
      },
    });
  }

  if (
    !user.verificationCode ||
    user.verificationCode !== cleanOtp ||
    !user.verificationExpiresAt ||
    new Date(user.verificationExpiresAt) < new Date()
  ) {
    return res.status(400).json({ error: "Invalid or expired verification code. Please request a new code." });
  }

  // Mark verified
  const now = new Date();
  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        isVerified: true,
        verificationCode: null,
        verificationExpiresAt: null,
        updatedAt: now,
      },
    }
  );

  const token = signToken(user._id);

  // Send Brevo Welcome Email
  sendBrevoEmail({
    to: [{ email: normalizedEmail }],
    subject: "Welcome to SiteFlow AI! 🚀",
    htmlContent: getWelcomeEmailHtml(normalizedEmail.split("@")[0]),
  }).catch((err) => console.error("Welcome email error:", err));

  res.json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      created_at: toIso(user.createdAt),
    },
  });
});

/**
 * RESEND VERIFICATION CONTROLLER
 * Generates a fresh OTP and dispatches Brevo email for unverified accounts
 */
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ error: "Email address is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = await connectMongo();
  const users = db.collection<UserDoc>("users");

  const user = await users.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(404).json({ error: "No account found with this email address." });
  }

  if (user.isVerified) {
    return res.status(400).json({ error: "Your email address is already verified! Please log in." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        verificationCode: otp,
        verificationExpiresAt: expiresAt,
        updatedAt: new Date(),
      },
    }
  );

  sendBrevoEmail({
    to: [{ email: normalizedEmail }],
    subject: `Your SiteFlow AI Verification Code: ${otp} 🔐`,
    htmlContent: getOtpEmailHtml(otp),
  }).catch((err) => console.error("Brevo resend OTP error:", err));

  res.json({ message: "A new 6-digit verification code has been sent to your email!" });
});

/**
 * LOGIN CONTROLLER
 * Validates credentials and BLOCKS unverified accounts until OTP email verification is complete
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = await connectMongo();
  const users = db.collection<UserDoc>("users");

  const user = await users.findOne({ email: normalizedEmail });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // BLOCK UNVERIFIED ACCOUNTS
  if (user.isVerified === false) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          verificationCode: otp,
          verificationExpiresAt: expiresAt,
          updatedAt: new Date(),
        },
      }
    );

    sendBrevoEmail({
      to: [{ email: normalizedEmail }],
      subject: `Your SiteFlow AI Verification Code: ${otp} 🔐`,
      htmlContent: getOtpEmailHtml(otp),
    }).catch((err) => console.error("Brevo login OTP error:", err));

    return res.status(403).json({
      error: "Please verify your email address first. A new 6-digit verification code has been sent to your email.",
      isUnverified: true,
      email: normalizedEmail,
    });
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
      error: "BREVO_API_KEY is not configured on the server. Please check server environment settings.",
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
