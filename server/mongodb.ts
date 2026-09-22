import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

const client = new MongoClient(uri);

let db: Db | null = null;
let indexesCreated = false;

export async function connectMongo(): Promise<Db> {
  if (db) return db;
  await client.connect();
  db = client.db();

  // Create TTL index on email_otps collection so OTP records auto-delete after 10 minutes (600s)
  if (!indexesCreated) {
    try {
      await db.collection("email_otps").createIndex({ createdAt: 1 }, { expireAfterSeconds: 600 });
      indexesCreated = true;
    } catch (err) {
      console.warn("MongoDB TTL index initialization notice:", err);
    }
  }

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
    indexesCreated = false;
  }
}

export { client };
