import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

const client = new MongoClient(uri);

let db: Db | null = null;

export async function connectMongo(): Promise<Db> {
  if (db) return db;
  await client.connect();
  db = client.db();
  return db;
}

export async function pingMongo(): Promise<boolean> {
  const database = await connectMongo();
  await database.command({ ping: 1 });
  return true;
}

export async function closeMongo(): Promise<void> {
  if (db) {
    await client.close();
    db = null;
  }
}

export { client };
