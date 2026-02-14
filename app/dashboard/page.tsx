"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/select-profile")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">
        Welcome, {user.name}
      </h1>

      <p className="text-gray-600 mb-8">
        Explore your network and discover strong introduction paths.
      </p>

      <div className="space-x-4">
        <button
          onClick={() => router.push("/explorer")}
          className="bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          Go to Explorer
        </button>

        <button
          onClick={logout}
          className="border px-6 py-3 rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
