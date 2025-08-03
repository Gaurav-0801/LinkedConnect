import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LinkedConnect - Professional Networking Platform",
  description: "Connect with professionals, share insights, and grow your career",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* wraps with Auth + Session context */}
      </body>
    </html>
  )
}
