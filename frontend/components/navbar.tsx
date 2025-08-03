"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import {
  Home,
  Users,
  MessageSquare,
  Bell,
  Search,
  LogOut,
  User,
  Briefcase,
} from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">in</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">LinkedConnect</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search professionals..."
                className="pl-10 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-blue-600 h-9"
              />
            </div>
          </div>

          {/* Navigation */}
          {user && (
            <div className="flex items-center space-x-1">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex flex-col items-center p-2 h-12 hover:bg-gray-100">
                  <Home className="w-5 h-5" />
                  <span className="text-xs hidden sm:block">Home</span>
                </Button>
              </Link>

              <Button variant="ghost" size="sm" className="flex flex-col items-center p-2 h-12 hover:bg-gray-100">
                <Users className="w-5 h-5" />
                <span className="text-xs hidden sm:block">Network</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex flex-col items-center p-2 h-12 hover:bg-gray-100">
                <Briefcase className="w-5 h-5" />
                <span className="text-xs hidden sm:block">Jobs</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex flex-col items-center p-2 h-12 hover:bg-gray-100">
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs hidden sm:block">Messages</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex flex-col items-center p-2 h-12 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="text-xs hidden sm:block">Notifications</span>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center p-2 h-12 hover:bg-gray-100">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={user.image || "/placeholder.svg"}
                        alt={user.name || ""}
                      />
                      <AvatarFallback className="text-xs bg-blue-600 text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs hidden sm:block">Me</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64 z-[999]" align="end" forceMount>
                  <div className="flex items-center space-x-3 p-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || ""} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.id}`} className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 cursor-pointer focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
