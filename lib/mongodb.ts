import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);

    console.log("✅ Connected to MongoDB");
    console.log(conn.connection.host);

    return conn;
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    throw err;
  }
}