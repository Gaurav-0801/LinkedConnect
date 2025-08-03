"use client"


import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { BACKEND_URL } from "@/lib/constants";

interface User {
  id: string
  name: string
  email: string
  image?: string
  emailVerified?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
   
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        
        
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      // Redirect to Google OAuth
      window.location.href = `${BACKEND_URL}/api/auth/google`
    } catch (error) {
      console.error("Google login failed:", error)
      throw error
    }
  }

 const logout = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    setUser(null);
    window.location.href = "/login"; 
  }
}


  return <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
