import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;
let indexesCreated = false;

function getClient(): MongoClient {
  if (client) return client;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables. Please add MONGODB_URI in Vercel Project Settings > Environment Variables.");
  }
  client = new MongoClient(uri);
  return client;
}

export async function connectMongo(): Promise<Db> {
  if (db) return db;
  const mongoClient = getClient();
  await mongoClient.connect();
  db = mongoClient.db();

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
  if (client) {
    await client.close();
    client = null;
    db = null;
    indexesCreated = false;
  }
}

export { client };
