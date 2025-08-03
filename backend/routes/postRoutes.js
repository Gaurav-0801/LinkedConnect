
import express from "express";
import {
  createPost,
  getFeed,
  getUserProfile,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/post", createPost);
router.get("/feed", getFeed);
router.get("/profile/:id", getUserProfile);

export default router;
