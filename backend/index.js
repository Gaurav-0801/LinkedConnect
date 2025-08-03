// backend/index.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import postRoutes from "./routes/postRoutes.js";


dotenv.config();
const prisma = new PrismaClient();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://linked-connect.vercel.app"
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use("/api", postRoutes);

app.listen(4000, () => {
  console.log("🚀 Backend running on http://localhost:4000");
});
