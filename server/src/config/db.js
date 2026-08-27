import dns from "node:dns";
import mongoose from "mongoose";

// The machine's default resolver (a local 127.0.0.1 DNS proxy) refuses SRV
// lookups, which breaks mongodb+srv:// URIs. Force public resolvers.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠ MongoDB disconnected — retrying…");
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.error("↻ Retrying in 10s… (server stays up; DB routes will recover automatically)");
    setTimeout(connectDB, 10000);
  }
};

export default connectDB;
