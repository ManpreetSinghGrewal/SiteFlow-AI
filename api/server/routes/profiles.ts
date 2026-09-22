import { Router } from "express";
import { connectMongo } from "../mongodb.js";
import { requireAuth } from "../middleware/auth.js";
import { serializeProfile } from "../serialize.js";
import type { AuthRequest } from "../middleware/auth.js";
import type { ProfileDoc } from "../types.js";

const router = Router();

router.get("/:userId", requireAuth, async (req: AuthRequest, res) => {
  if (req.params.userId !== req.userId!.toString()) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const db = await connectMongo();
  const profile = await db.collection<ProfileDoc>("profiles").findOne({
    userId: req.userId!,
  });

  if (!profile) {
    return res.json(null);
  }

  res.json(serializeProfile(profile));
});

router.put("/:userId", requireAuth, async (req: AuthRequest, res) => {
  if (req.params.userId !== req.userId!.toString()) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { display_name, business_name } = req.body as {
    display_name?: string | null;
    business_name?: string | null;
  };

  const db = await connectMongo();
  const profiles = db.collection<ProfileDoc>("profiles");
  const now = new Date();

  const result = await profiles.findOneAndUpdate(
    { userId: req.userId! },
    {
      $set: {
        display_name: display_name ?? null,
        business_name: business_name ?? null,
        updated_at: now,
      },
      $setOnInsert: {
        userId: req.userId!,
        created_at: now,
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  res.json(serializeProfile(result!));
});

export default router;
