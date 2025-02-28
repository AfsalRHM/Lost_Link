import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function dbConnection() {
  try {
    mongoose.connect(process.env.MONGO_URI as string);
    console.log("mongodb connected successfully");
  } catch (error) {
    console.log("mongodb connection failed");
  }
}
