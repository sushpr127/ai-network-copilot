"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import UserChip from "@/components/UserChip"
import HorizontalPath from "@/components/path/HorizontalPath"
import PathGraph from "@/components/graph/PathGraph"

type User = {
  id: string
  name: string
  job_title?: string
  industry?: string
}

type Path = {
  path: string[]
  strength: number
}

export default function ExplorerPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [target, setTarget] = useState("")
  const [paths, setPaths] = useState<Path[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!user) router.push("/select-profile")
  }, [user, router])

  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/test")
      const data = await res.json()
      setUsers(data)
    }
    fetchUsers()
  }, [])

  async function handleSearch() {
    if (!user || !target) return

    setLoading(true)
    setError("")
    setPaths([])

    try {
      const res = await fetch(
        `/api/paths?source=${user.id}&target=${target}`
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
      } else {
        setPaths(data)
      }
    } catch {
      setError("Failed to fetch paths")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-3 text-gray-900">
          Introduction Path Explorer
        </h1>

        <p className="text-gray-600 mb-10">
          Discover the strongest multi-hop introduction paths in your network.
        </p>

        {/* CONTROLS */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">

          <div className="grid md:grid-cols-2 gap-6 mb-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logged In As
              </label>
              <div className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100">
                {user.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Professional
              </label>
              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option value="">Select Target</option>
                {users
                  .filter((u) => u.id !== user.id)
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition duration-200"
          >
            {loading ? "Analyzing Network..." : "Find Strongest Introduction Paths"}
          </button>

          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}
        </div>

        {/* RESULTS */}
        {paths.length > 0 && (
          <div className="space-y-12">
            <h2 className="text-2xl font-semibold text-gray-900">
              Ranked Introduction Paths
            </h2>

            {paths.map((p, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10"
              >
                <div className="flex justify-between items-center mb-10">
                  <span className="font-semibold text-lg text-gray-800">
                    Path #{index + 1}
                  </span>

                  <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold">
                    Strength: {p.strength.toFixed(3)}
                  </span>
                </div>

                {/* 🔥 HORIZONTAL ANIMATED PATH */}
                <HorizontalPath path={p.path} users={users} />

                {/* 🔥 GRAPH VISUALIZATION */}
                <div className="mt-10">
                  <PathGraph path={p.path} users={users} />
                </div>

                {/* Strength Bar */}
                <div className="mt-10 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${p.strength * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && paths.length === 0 && target && (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
            <p className="text-yellow-800 font-medium">
              No strong introduction paths found.
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Try selecting a different professional.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
