"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Heart, MessageSquare, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";


export default function LikeCommentShareButtons({
  postId,
  initialLiked,
  initialLikeCount,
}: {
  postId: string;
  initialLiked: boolean;
  initialLikeCount: number;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState(0);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/posts/${postId}/comments`,
        { withCredentials: true }
      );
      setComments(res.data || []);
      setCommentCount(res.data.length || 0);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  // Toggle dropdown + fetch comments
  const toggleComments = () => {
    const visible = !commentsVisible;
    setCommentsVisible(visible);
    if (visible) fetchComments();
  };

  const handleLike = async () => {
    try {
      if (!userId) return;

      await axios.post(
        `http://localhost:4000/api/posts/${postId}/like`,
        { userId },
        { withCredentials: true }
      );

      if (liked) {
        setLikeCount((prev) => Math.max(prev - 1, 0));
        setLiked(false);
      } else {
        setLikeCount((prev) => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleComment = async () => {
    try {
      if (!comment.trim() || !userId) return;
      await axios.post(`${BACKEND_URL}/api/posts/${postId}/comment`, {
  content: comment,
  userId
}, {
  withCredentials: true
});

      setComment("");
      setShowCommentBox(false);
      fetchComments();
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/post/${postId}`
      );
      alert("Post URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="pt-3 border-t border-gray-100">
      <div className="flex items-center space-x-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`hover:bg-red-50 ${
            liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        >
          <Heart className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {liked ? "Liked" : "Like"} ({likeCount})
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleComments}
          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          <span className="text-sm">Comment ({commentCount})</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="text-gray-600 hover:text-green-600 hover:bg-green-50"
        >
          <Share className="w-4 h-4 mr-2" />
          <span className="text-sm">Share</span>
        </Button>
      </div>

      {commentsVisible && (
        <div className="mt-4 space-y-2">
          <textarea
            placeholder="Write a comment..."
            className="w-full border rounded p-2 text-sm"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            onClick={handleComment}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm mt-2"
          >
            Post Comment
          </Button>

          <div className="mt-4 text-sm text-gray-700 space-y-2">
            {comments.length === 0 ? (
              <p className="text-gray-400">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="border rounded p-2 bg-gray-50 text-sm"
                >
                  <strong>{c.author?.name || "User"}</strong>: {c.content}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
