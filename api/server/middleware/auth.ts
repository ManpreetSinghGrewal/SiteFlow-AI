import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { connectMongo } from "../mongodb";
import type { UserDoc } from "../types";

function getJwtSecret(): string {
  return process.env.JWT_SECRET || "siteflow-dev-secret-change-in-production";
}

export interface AuthRequest extends Request {
  userId?: ObjectId;
  user?: UserDoc;
}

export function signToken(userId: ObjectId): string {
  return jwt.sign({ sub: userId.toString() }, getJwtSecret(), { expiresIn: "30d" });
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(header.slice(7), getJwtSecret()) as { sub: string };
    if (!ObjectId.isValid(payload.sub)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = new ObjectId(payload.sub);
    const db = await connectMongo();
    const user = await db.collection<UserDoc>("users").findOne({ _id: userId });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = userId;
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
