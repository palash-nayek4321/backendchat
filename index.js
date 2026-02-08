import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import groupRoutes from "./routes/GroupRoutes.js";
import friendRequestsRoutes from "./routes/FriendRequestsRoute.js";
import uploadRoutes from "./routes/UploadRoutes.js";
import statusRoutes from "./routes/StatusRoutes.js";

dotenv.config();

const app = express();
const databaseURL = process.env.DATABASE_URL;

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  if (!databaseURL) {
    throw new Error("DATABASE_URL is not defined");
  }
  await mongoose.connect(databaseURL);
  isConnected = true;
  console.log("Connected to MongoDB successfully.");
};

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/friend-requests", friendRequestsRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/status", statusRoutes);

export default app;
