"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-700">
          WarmConnect AI
        </Link>

        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>

          {user && (
            <>
              <Link href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/explorer" className="hover:text-blue-600">
                Explorer
              </Link>
            </>
          )}

          <Link href="/about" className="hover:text-blue-600">
            How It Works
          </Link>

          {user ? (
            <>
              <span className="text-gray-500">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/select-profile")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
