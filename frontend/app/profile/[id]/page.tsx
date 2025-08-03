"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Navbar } from "@/components/navbar"
import { LoginPage } from "@/components/login-page"
import { useAuth } from "@/hooks/use-auth"
import {
  Loader2,
  MessageSquare,
  Heart,
  Share,
  Calendar,
  Mail,
  Briefcase,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  image?: string
  createdAt: string
  posts: Array<{
    id: string
    content: string
    createdAt: string
  }>
}

export default function ProfilePage() {
  const { user: currentUser, isLoading: authLoading } = useAuth()
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser && userId) {
      fetchUserProfile()
    }
  }, [currentUser, userId])

  const fetchUserProfile = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:4000/api/profile/${userId}`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else if (response.status === 404) {
        setError("User not found")
      } else {
        setError("Failed to load profile")
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      setError("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-4 text-gray-600">Loading profile...</p>
      </div>
    )
  }

  if (!currentUser) return <LoginPage />

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-500 text-lg mb-2">{error || "Profile not found"}</div>
              <p className="text-gray-500">The user you're looking for doesn't exist or has been removed.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser.id === user.id

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="mb-6 overflow-hidden shadow-sm">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          </div>

          <CardContent className="p-0">
            <div className="px-6 -mt-16 pb-6 flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              <Avatar className="w-32 h-32 border-[5px] border-white shadow-xl rounded-full">
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || ""} />
                <AvatarFallback className="text-4xl bg-blue-600 text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug">
                      {user.name || "Anonymous User"}
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">Professional at LinkedConnect</p>
                    <p className="text-gray-400 text-xs mt-1">Building connections and sharing insights</p>
                  </div>

                  <div className="mt-4 sm:mt-0 flex gap-2">
                    {!isOwnProfile ? (
                      <>
                        <Button className="bg-blue-600 hover:bg-blue-700 transition rounded-full px-4 py-1.5 text-sm">
                          Connect
                        </Button>
                        <Button variant="outline" className="rounded-full px-4 py-1.5 text-sm">
                          Message
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" className="rounded-full px-4 py-1.5 text-sm">
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>
                  {user.posts.length} {user.posts.length === 1 ? "post" : "posts"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Open to work</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">
                  {isOwnProfile
                    ? "Welcome to your profile! Share your professional story and connect with others in your industry."
                    : `${user.name} is a professional member of the LinkedConnect community, sharing insights and building meaningful connections.`}
                </p>
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium text-gray-900 mb-2">Skills & Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm shadow-sm">
                      Professional Networking
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm shadow-sm">
                      Communication
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm shadow-sm">
                      Leadership
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Posts */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isOwnProfile ? "Your Activity" : `${user.name}'s Posts`}
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {user.posts.length} {user.posts.length === 1 ? "post" : "posts"}
                </span>
              </div>

              {user.posts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500">
                      {isOwnProfile
                        ? "Share your first post to start building your professional presence!"
                        : "This user hasn't shared any posts yet."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {user.posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || ""} />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900">{user.name || "Anonymous"}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500 text-sm">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base mb-4">
                              {post.content}
                            </p>
                            <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500">
                                <Heart className="w-4 h-4 mr-1" />
                                Like
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Comment
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                                <Share className="w-4 h-4 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
