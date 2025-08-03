"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { signIn } from "next-auth/react"
import { Loader2, Users, MessageSquare, Briefcase, TrendingUp } from "lucide-react"


export function LoginPage() {

  const { loginWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
        await signIn("google", { callbackUrl: "/dashboard" })
    
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">in</span>
            </div>
            <span className="font-bold text-xl text-gray-900">LinkedConnect</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Highlights */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Welcome to the future of{" "}
                  <span className="text-blue-600">professional networking</span>
                </h1>
                <p className="text-xl text-gray-600 mt-4 leading-relaxed">
                  Connect with industry professionals, share your insights, and grow your career with LinkedConnect.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Users, title: "Build Network", subtitle: "Connect with professionals" },
                  { icon: MessageSquare, title: "Share Ideas", subtitle: "Post insights & updates" },
                  { icon: Briefcase, title: "Find Opportunities", subtitle: "Discover career paths" },
                  { icon: TrendingUp, title: "Grow Career", subtitle: "Advance professionally" },
                ].map(({ icon: Icon, title, subtitle }, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{title}</h3>
                      <p className="text-sm text-gray-600">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-900">Join LinkedConnect</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Sign in to start building your professional network
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <Button
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Continue with Google
                        </>
                      )}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Trusted by professionals</span>
                      </div>
                    </div>

                    <ul className="text-xs bg-gray-50 p-3 rounded-lg space-y-1">
                      <li>✓ Build meaningful professional relationships</li>
                      <li>✓ Share industry insights and thought leadership</li>
                      <li>✓ Discover new career opportunities</li>
                      <li>✓ Stay updated with industry trends</li>
                    </ul>
                  </div>

                  <div className="mt-8 text-center text-xs text-gray-500">
                    By signing in, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{" "}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
