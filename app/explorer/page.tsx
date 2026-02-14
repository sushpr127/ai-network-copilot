"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import UserChip from "@/components/UserChip"
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
  hops: number
  edgeStrengths: number[]
}

export default function ExplorerPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [target, setTarget] = useState("")
  const [paths, setPaths] = useState<Path[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/select-profile")
    }
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
    setStatus(null)

    try {
      const res = await fetch(
        `/api/paths?source=${user.id}&target=${target}`
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
      } else {
        setPaths(data.paths || [])
        setStatus(data.status || null)
      }
    } catch {
      setError("Failed to fetch paths")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold mb-3">
          Introduction Path Explorer
        </h1>

        <p className="text-slate-600 mb-10">
          Discover the strongest multi-hop introduction paths in your network.
        </p>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-6 mb-6">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Logged In As
              </label>
              <div className="w-full border border-slate-300 p-3 rounded-lg bg-white text-slate-900 font-semibold">
                {user.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Professional
              </label>
              <select
                className="w-full border border-slate-300 bg-white text-slate-900 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {/* Results */}
        {paths.length > 0 && (
          <div className="space-y-16">

            <h2 className="text-2xl font-semibold">
              Ranked Introduction Paths
            </h2>

            {paths.map((p, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 space-y-10"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-slate-800">
                    Path #{index + 1}
                  </span>

                  <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold">
                    Strength: {p.strength.toFixed(3)}
                  </span>
                </div>

                {/* Horizontal Layout */}
                <div className="overflow-x-auto">
                  <div className="flex items-center gap-8 py-6 min-w-max">
                    {p.path.map((nodeId, i) => {
                      const userData = users.find((u) => u.id === nodeId)
                      if (!userData) return null

                      const edgeStrength = p.edgeStrengths[i]

                      return (
                        <div key={i} className="flex items-center gap-6">
                          <UserChip user={userData} />

                          {i < p.path.length - 1 && (
                            <div className="flex flex-col items-center text-xs">
                              <span className="text-slate-400 text-2xl">→</span>
                              <span className="text-indigo-600 font-semibold">
                                {edgeStrength?.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-200" />

                {/* Graph Section */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                    Network Visualization
                  </h3>

                  <div className="h-[420px]">
                    <PathGraph
                      path={p.path}
                      users={users}
                      edgeStrengths={p.edgeStrengths}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200" />

                {/* Strength Bar */}
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${p.strength * 100}%` }}
                  />
                </div>

              </div>
            ))}
          </div>
        )}

        {/* No Path Found UI */}
        {!loading && status === "no_path_found" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No Introduction Path Found
            </h3>
            <p className="text-slate-500">
              There is currently no viable multi-hop connection between these professionals.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
