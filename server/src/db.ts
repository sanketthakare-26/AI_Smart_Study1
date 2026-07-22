import mongoose from "mongoose";
import dns from "dns";

// Force Node to use public DNS servers for resolving SRV records, 
// avoiding local Windows DNS resolution glitches
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("⚠️ Failed to set custom DNS servers, using system defaults.");
}

export async function connectDB() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error("❌ MONGO_URL is missing in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUrl);
    console.log("🚀 Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}
export { mongoose };
