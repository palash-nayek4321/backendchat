import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import groupRoutes from "./routes/GroupRoutes.js";
import setupSocket from "./socket.js";
import friendRequestsRoutes from "./routes/FriendRequestsRoute.js";
import uploadRoutes from "./routes/UploadRoutes.js";
import statusRoutes from "./routes/StatusRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;
const origin = process.env.ORIGIN;

if (!databaseURL) {
  throw new Error("DATABASE_URL is missing");
}
if (!origin) {
  throw new Error("ORIGIN is missing");
}

app.use(
  cors({
    origin: [origin],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/friend-requests", friendRequestsRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/status", statusRoutes);

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    setupSocket(server);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
