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

app.use(cors({ origin: process.env.NEXTAUTH_URL, credentials: true }));
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
