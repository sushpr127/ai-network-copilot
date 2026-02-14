"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const navItem = (href: string, label: string) => {
    const isActive = pathname === href

    return (
      <Link
        href={href}
        className={`transition font-medium ${
          isActive
            ? "text-indigo-600"
            : "text-slate-600 hover:text-indigo-600"
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-indigo-600"
        >
          WarmConnect AI
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8 text-sm">

          {navItem("/", "Home")}

          {user && (
            <>
              {navItem("/dashboard", "Dashboard")}
              {navItem("/explorer", "Explorer")}
            </>
          )}

          {navItem("/how-it-works", "How It Works")}

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center space-x-4 ml-6">

              <span className="text-slate-700 font-medium">
                {user.name}
              </span>

              <button
                onClick={logout}
                className="text-slate-500 hover:text-indigo-600 transition"
              >
                Logout
              </button>

            </div>
          ) : (
            <button
              onClick={() => router.push("/select-profile")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Login
            </button>
          )}

        </div>
      </div>
    </nav>
  )
}
