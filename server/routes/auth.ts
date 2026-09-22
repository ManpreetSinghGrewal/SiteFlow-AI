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

export interface OtpDoc {
  _id?: ObjectId;
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * POST /api/auth/send-otp
 * Validates email, generates 6-digit OTP, saves in email_otps collection (TTL 10m), & dispatches Brevo email
 */
router.post("/send-otp", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email) {
    return res.status(400).json({ error: "Email address is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = await connectMongo();
  const otps = db.collection<OtpDoc>("email_otps");
  const users = db.collection<UserDoc>("users");

  const existingUser = await users.findOne({ email: normalizedEmail });
  if (existingUser && existingUser.isVerified) {
    return res.status(409).json({ error: "An account with this email is already verified. Please log in." });
  }

  // Delete previous pending OTPs for this email
  await otps.deleteMany({ email: normalizedEmail });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

  console.log(`[SITEFLOW OTP DISPATCH] Email: ${normalizedEmail} | 6-Digit OTP: ${otp}`);

  // Save OTP in MongoDB email_otps collection
  await otps.insertOne({
    email: normalizedEmail,
    otp,
    createdAt: now,
    expiresAt,
  });

  // Stage or update unverified user doc
  if (existingUser) {
    const updateData: Record<string, any> = {
      verificationCode: otp,
      verificationExpiresAt: expiresAt,
      updatedAt: now,
    };
    if (password && password.length >= 6) {
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }
    await users.updateOne({ _id: existingUser._id }, { $set: updateData });
  } else {
    const userId = new ObjectId();
    const passwordHash = password && password.length >= 6 ? await bcrypt.hash(password, 12) : "";
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
      display_name: normalizedEmail.split("@")[0],
      business_name: null,
      created_at: now,
      updated_at: now,
    });
  }

  // Dispatch Brevo OTP Email via HTTPS REST API
  const emailResult = await sendBrevoEmail({
    to: [{ email: normalizedEmail }],
    subject: `Your SiteFlow AI Verification Code: ${otp} 🔐`,
    htmlContent: getOtpEmailHtml(otp),
  });

  if (!emailResult.success) {
    return res.status(400).json({
      error: emailResult.error || "BREVO_API_KEY is not configured on Vercel. Add BREVO_API_KEY under Vercel Project Settings > Environment Variables.",
    });
  }

  res.json({ ok: true, message: "Verification code sent to your email!", email: normalizedEmail });
});

/**
 * POST /api/auth/verify-otp (and /verify-email)
 * Verifies submitted 6-digit OTP code against email_otps collection, sets passwordHash, marks isVerified = true, and returns JWT token
 */
const verifyOtpHandler = async (req: any, res: any) => {
  const { email, otp, password, name } = req.body as {
    email?: string;
    otp?: string;
    password?: string;
    name?: string;
  };

  if (!email || !otp) {
    return res.status(400).json({ error: "Email address and 6-digit OTP code are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();
  const db = await connectMongo();
  const otps = db.collection<OtpDoc>("email_otps");
  const users = db.collection<UserDoc>("users");

  // Look up OTP in email_otps collection
  const otpRecord = await otps.findOne({ email: normalizedEmail, otp: cleanOtp });
  const user = await users.findOne({ email: normalizedEmail });

  const isValidOtp =
    (otpRecord && new Date(otpRecord.expiresAt) > new Date()) ||
    (user && user.verificationCode === cleanOtp && user.verificationExpiresAt && new Date(user.verificationExpiresAt) > new Date());

  if (!isValidOtp) {
    return res.status(400).json({ error: "Invalid or expired verification code. Please request a new code." });
  }

  const now = new Date();
  let targetUser = user;

  if (!targetUser) {
    const userId = new ObjectId();
    const passwordHash = password && password.length >= 6 ? await bcrypt.hash(password, 12) : "";
    await users.insertOne({
      _id: userId,
      email: normalizedEmail,
      passwordHash,
      isVerified: true,
      verificationCode: null,
      verificationExpiresAt: null,
      createdAt: now,
      updatedAt: now,
    });

    const profiles = db.collection<ProfileDoc>("profiles");
    await profiles.insertOne({
      _id: userId,
      userId,
      display_name: name || normalizedEmail.split("@")[0],
      business_name: null,
      created_at: now,
      updated_at: now,
    });

    targetUser = (await users.findOne({ _id: userId }))!;
  } else {
    const updateData: Record<string, any> = {
      isVerified: true,
      verificationCode: null,
      verificationExpiresAt: null,
      updatedAt: now,
    };
    if (password && password.length >= 6) {
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }
    await users.updateOne({ _id: targetUser._id }, { $set: updateData });
  }

  // Purge OTP records
  await otps.deleteMany({ email: normalizedEmail });

  const token = signToken(targetUser._id);

  // Send Brevo Welcome Email
  sendBrevoEmail({
    to: [{ email: normalizedEmail }],
    subject: "Welcome to SiteFlow AI! 🚀",
    htmlContent: getWelcomeEmailHtml(name || normalizedEmail.split("@")[0]),
  }).catch((err) => console.error("Welcome email error:", err));

  res.json({
    token,
    user: {
      id: targetUser._id.toString(),
      email: targetUser.email,
      created_at: toIso(targetUser.createdAt),
    },
  });
};

router.post("/verify-otp", verifyOtpHandler);
router.post("/verify-email", verifyOtpHandler);
router.post("/signup", async (req, res) => {
  // Signup redirects to send-otp
  req.url = "/send-otp";
  router.handle(req, res, () => {});
});

/**
 * POST /api/auth/login
 * Authenticates email + password. Enforces verification check and blocks unverified accounts.
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

  if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // BLOCK UNVERIFIED ACCOUNTS
  if (user.isVerified === false) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    const otps = db.collection<OtpDoc>("email_otps");
    await otps.deleteMany({ email: normalizedEmail });
    await otps.insertOne({ email: normalizedEmail, otp, createdAt: now, expiresAt });

    await users.updateOne(
      { _id: user._id },
      { $set: { verificationCode: otp, verificationExpiresAt: expiresAt, updatedAt: now } }
    );

    const emailResult = await sendBrevoEmail({
      to: [{ email: normalizedEmail }],
      subject: `Your SiteFlow AI Verification Code: ${otp} 🔐`,
      htmlContent: getOtpEmailHtml(otp),
    });

    if (!emailResult.success) {
      return res.status(400).json({
        error: emailResult.error || "BREVO_API_KEY is not configured on Vercel. Add BREVO_API_KEY under Vercel Settings > Environment Variables.",
      });
    }

    return res.status(403).json({
      error: "Please verify your email address first. A new 6-digit verification code has been sent to your email.",
      isUnverified: true,
      requiresOtp: true,
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

/**
 * POST /api/auth/resend-verification
 */
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ error: "Email address is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = await connectMongo();
  const otps = db.collection<OtpDoc>("email_otps");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

  await otps.deleteMany({ email: normalizedEmail });
  await otps.insertOne({ email: normalizedEmail, otp, createdAt: now, expiresAt });

  const emailResult = await sendBrevoEmail({
    to: [{ email: normalizedEmail }],
    subject: `Your SiteFlow AI Verification Code: ${otp} 🔐`,
    htmlContent: getOtpEmailHtml(otp),
  });

  if (!emailResult.success) {
    return res.status(400).json({
      error: emailResult.error || "BREVO_API_KEY is not configured on Vercel. Add BREVO_API_KEY under Vercel Settings > Environment Variables.",
    });
  }

  res.json({ message: "A new 6-digit verification code has been sent to your email!" });
});

/**
 * POST /api/auth/google
 * Handles Google SSO trigger + 2-phase Brevo OTP verification
 */
router.post("/google", async (req, res) => {
  const { email, name, otp, password } = req.body as {
    email?: string;
    name?: string;
    otp?: string;
    password?: string;
  };

  if (!email) {
    return res.status(400).json({ error: "Google email address is required" });
  }

  if (otp) {
    // Phase 2: verify OTP code
    return verifyOtpHandler(req, res);
  }

  // Phase 1: send OTP code
  const normalizedEmail = email.trim().toLowerCase();
  const db = await connectMongo();
  const otps = db.collection<OtpDoc>("email_otps");
  const users = db.collection<UserDoc>("users");

  const existingUser = await users.findOne({ email: normalizedEmail });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

  await otps.deleteMany({ email: normalizedEmail });
  await otps.insertOne({ email: normalizedEmail, otp, createdAt: now, expiresAt });

  const emailResult = await sendBrevoEmail({
    to: [{ email: normalizedEmail }],
    subject: `Your SiteFlow AI Verification Code: ${otp} 🔐`,
    htmlContent: getOtpEmailHtml(otp),
  });

  if (!emailResult.success) {
    return res.status(400).json({
      error: emailResult.error || "BREVO_API_KEY is not configured on Vercel. Add BREVO_API_KEY under Vercel Settings > Environment Variables.",
    });
  }

  res.json({
    requiresOtp: true,
    isNewUser: !existingUser || !existingUser.isVerified,
    email: normalizedEmail,
    name: name || normalizedEmail.split("@")[0],
    message: "Google authentication code dispatched to your email!",
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

  const emailResult = await sendBrevoEmail({
    to: [{ email: normalizedEmail }],
    subject: "Reset your SiteFlow AI password 🔑",
    htmlContent: getResetPasswordEmailHtml(resetUrl),
  });

  if (!emailResult.success) {
    return res.status(400).json({
      error: emailResult.error || "Failed to send reset email.",
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
