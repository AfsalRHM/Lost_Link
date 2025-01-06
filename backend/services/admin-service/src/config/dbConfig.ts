import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function dbConnection() {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI env not available");
    }

    mongoose.connect(MONGO_URI!);
    console.log("mongodb connected successfully");
  } catch (error) {
    console.log("mongodb connection failed", error);
  }
}
