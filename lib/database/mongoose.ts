import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {

  var mongoose: MongooseConnection | undefined;
}

const cached: MongooseConnection = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export const connectToDatabase = async () => {
  if (cached.conn) {
    console.log("[MongoDB] Reusing existing database connection");
    return cached.conn;
  }

  if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URL, {
        dbName: "hrmanagement",
        bufferCommands: false,
      });

    cached.conn = await cached.promise;

    console.log("[MongoDB] New database connection established");

    return cached.conn;
  } catch (error) {
    console.error("[MongoDB] Connection error:", error);
    throw error;
  }
};
