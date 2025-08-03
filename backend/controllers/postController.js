// backend/controllers/postController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  const { userId, content } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorId: userId,
      },
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getFeed = async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { posts: { orderBy: { createdAt: "desc" } } },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
