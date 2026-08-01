import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export const connectToDB = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    console.log("✅ Already Connected");
    return;
  }

  try {
    console.log("Connecting to:", MONGODB_URI.replace(/\/\/.*?:.*?@/, "//***:***@"));

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:");
    console.error(error);
    throw error;
  }
};