import { Router } from "express";
import { ObjectId } from "mongodb";
import { connectMongo } from "../mongodb.js";
import { requireAuth } from "../middleware/auth.js";
import { parseObjectId, serializeProject } from "../serialize.js";
import type { AuthRequest } from "../middleware/auth.js";
import type { ProjectDoc } from "../types.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const db = await connectMongo();
  const projects = await db
    .collection<ProjectDoc>("projects")
    .find({ user_id: req.userId! })
    .sort({ created_at: -1 })
    .toArray();

  res.json(projects.map(serializeProject));
});

router.get("/count", requireAuth, async (req: AuthRequest, res) => {
  const db = await connectMongo();
  const count = await db.collection<ProjectDoc>("projects").countDocuments({
    user_id: req.userId!,
  });

  res.json({ count });
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const projectId = parseObjectId(req.params.id);
  if (!projectId) {
    return res.status(400).json({ error: "Invalid project id" });
  }

  const db = await connectMongo();
  const project = await db.collection<ProjectDoc>("projects").findOne({
    _id: projectId,
    user_id: req.userId!,
  });

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  res.json(serializeProject(project));
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { name, business_type, html_content, status, thumbnail_url } = req.body as {
    name?: string;
    business_type?: string | null;
    html_content?: string | null;
    status?: "draft" | "published";
    thumbnail_url?: string | null;
  };

  if (!name?.trim()) {
    return res.status(400).json({ error: "Project name is required" });
  }

  const now = new Date();
  const doc: ProjectDoc = {
    _id: new ObjectId(),
    user_id: req.userId!,
    name: name.trim(),
    business_type: business_type ?? null,
    html_content: html_content ?? null,
    thumbnail_url: thumbnail_url ?? null,
    status: status === "published" ? "published" : "draft",
    created_at: now,
    updated_at: now,
  };

  const db = await connectMongo();
  await db.collection<ProjectDoc>("projects").insertOne(doc);

  res.status(201).json(serializeProject(doc));
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  const projectId = parseObjectId(req.params.id);
  if (!projectId) {
    return res.status(400).json({ error: "Invalid project id" });
  }

  const { name, business_type, html_content, status, thumbnail_url } = req.body as {
    name?: string;
    business_type?: string | null;
    html_content?: string | null;
    status?: "draft" | "published";
    thumbnail_url?: string | null;
  };

  const updates: Partial<ProjectDoc> = { updated_at: new Date() };
  if (name !== undefined) updates.name = name.trim();
  if (business_type !== undefined) updates.business_type = business_type;
  if (html_content !== undefined) updates.html_content = html_content;
  if (thumbnail_url !== undefined) updates.thumbnail_url = thumbnail_url;
  if (status !== undefined) updates.status = status === "published" ? "published" : "draft";

  const db = await connectMongo();
  const result = await db.collection<ProjectDoc>("projects").findOneAndUpdate(
    { _id: projectId, user_id: req.userId! },
    { $set: updates },
    { returnDocument: "after" }
  );

  if (!result) {
    return res.status(404).json({ error: "Project not found" });
  }

  res.json(serializeProject(result));
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const projectId = parseObjectId(req.params.id);
  if (!projectId) {
    return res.status(400).json({ error: "Invalid project id" });
  }

  const db = await connectMongo();
  const result = await db.collection<ProjectDoc>("projects").deleteOne({
    _id: projectId,
    user_id: req.userId!,
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Project not found" });
  }

  res.status(204).send();
});

export default router;
