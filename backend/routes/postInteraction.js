import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Like a post
export const likePost = async (req, res) => {
  const { userId } = req.body;
  const postId = req.params.postId;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    await prisma.like.upsert({
      where: {
        userId_postId: { userId, postId },
      },
      update: {},
      create: {
        userId,
        postId,
      },
    });
    res.status(200).json({ message: "Post liked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like post" });
  }
};

// Comment on a post
export const commentOnPost = async (req, res) => {
  const { userId, content } = req.body;
  const postId = req.params.postId;

  if (!userId || !content) {
    return res.status(400).json({ error: "Missing userId or content" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to comment" });
  }
};

export const getPostComments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
