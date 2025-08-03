
import express from "express";
import {
  createPost,
  getFeed,
  getUserProfile,
} from "../controllers/postController.js";
import { likePost,commentOnPost,getPostComments } from "./postInteraction.js";

const router = express.Router();

router.post("/post", createPost);
router.get("/feed", getFeed);
router.get("/profile/:id", getUserProfile);
router.post("/posts/:postId/like", likePost);
router.post("/posts/:postId/comment", commentOnPost);
router.get("/posts/:postId/comments", getPostComments);


export default router;
