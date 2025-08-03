// app/dashboard/page.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, MessageSquare, Heart, Share, Send, TrendingUp } from "lucide-react"
import LikeCommentShareButtons from "@/components/LikecommentshareButton";
import { BACKEND_URL } from "@/lib/constants"


interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  likeCount: number;
  hasLiked: boolean;
}


export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) fetchPosts()
  }, [user])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/feed`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim() || !user?.id) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.id, content: newPost.trim() }),
      })

      if (response.ok) {
        setNewPost("")
        fetchPosts()
      }
    } catch (error) {
      console.error("Failed to create post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Not authenticated</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-0">
                <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg"></div>
                <div className="px-4 pb-4">
                  <div className="flex flex-col items-center -mt-8">
                    <Avatar className="w-16 h-16 border-4 border-white">
                      <AvatarImage src={user.image || "/placeholder.svg?height=64&width=64"} alt={user.name || ""} />
                      <AvatarFallback className="text-lg font-semibold bg-blue-600 text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-2 font-semibold text-gray-900 text-center">{user.name}</h3>
                    <p className="text-sm text-gray-600 text-center">{user.email}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <Link href={`/profile/${user.id}`}>
                      <Button variant="outline" className="w-full bg-transparent">
                        View Profile
                      </Button>
                    </Link>
                    <div className="text-center text-sm text-gray-500">
                      <p>Build your professional network</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Trending</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600 hover:text-blue-600 cursor-pointer">#WebDevelopment</div>
                  <div className="text-gray-600 hover:text-blue-600 cursor-pointer">#React</div>
                  <div className="text-gray-600 hover:text-blue-600 cursor-pointer">#JavaScript</div>
                  <div className="text-gray-600 hover:text-blue-600 cursor-pointer">#TechCareers</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card>
              <CardContent className="p-4">
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={user.image || "/placeholder.svg?height=40&width=40"} alt={user.name || ""} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="What's happening in your professional world?"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0 text-base placeholder:text-gray-500"
                        maxLength={500}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{newPost.length}/500</span>
                      {newPost.length > 450 && <span className="text-orange-500">Character limit approaching</span>}
                    </div>
                    <Button
                      type="submit"
                      disabled={!newPost.trim() || isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading your feed...</p>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to LinkedConnect!</h3>
                  <p className="text-gray-500 mb-4">Be the first to share something with the community.</p>
                  <p className="text-sm text-gray-400">Share your thoughts, insights, or professional updates.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={post.author.image || "/placeholder.svg?height=48&width=48"} alt={post.author.name || ""} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {post.author.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Link href={`/profile/${post.author.id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {post.author.name || "Anonymous User"}
                            </Link>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">
                              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed mb-4 text-base">
                            {post.content}
                          </p>
                          <LikeCommentShareButtons
  postId={post.id}
  initialLiked={post.hasLiked}
  initialLikeCount={post.likeCount || 0}
/>



                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">People you may know</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-200">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-500">Software Engineer</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">Connect</Button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-200">JS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Jane Smith</p>
                      <p className="text-xs text-gray-500">Product Manager</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">Connect</Button>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-4 text-sm text-blue-600">Show more</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
