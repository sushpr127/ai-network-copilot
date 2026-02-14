"use client"

import { useEffect, useState } from "react"

type User = {
  id: string
  name: string
}

type Path = {
  path: string[]
  strength: number
}

export default function ExplorerPage() {
  const [users, setUsers] = useState<User[]>([])
  const [source, setSource] = useState("")
  const [target, setTarget] = useState("")
  const [paths, setPaths] = useState<Path[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/test")
      const data = await res.json()
      setUsers(data)
    }
    fetchUsers()
  }, [])

  async function handleSearch() {
    if (!source || !target) return

    setLoading(true)
    setError("")
    setPaths([])

    try {
      const res = await fetch(
        `/api/paths?source=${source}&target=${target}`
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
      } else {
        setPaths(data.paths || [])
      }
    } catch {
      setError("Failed to fetch paths")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Introduction Path Explorer
      </h1>
      <p className="text-gray-600 mb-8">
        Discover the strongest multi-hop introduction paths between professionals.
      </p>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Source Professional
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="">Select Source</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Target Professional
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="">Select Target</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
        >
          {loading ? "Analyzing Network..." : "Find Strongest Introduction Paths"}
        </button>

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}
      </div>

      {/* Results */}
      {paths.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            Ranked Introduction Paths
          </h2>

          {paths.map((p, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg">
                  Path #{index + 1}
                </span>
                <span className="text-blue-700 font-semibold">
                  Strength: {p.strength.toFixed(3)}
                </span>
              </div>

              <div className="flex flex-wrap items-center text-gray-700 mb-4">
                {p.path.map((node, i) => (
                  <span key={i} className="font-medium">
                    {node}
                    {i < p.path.length - 1 && (
                      <span className="mx-3 text-gray-400">→</span>
                    )}
                  </span>
                ))}
              </div>

              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-700 transition-all duration-500"
                  style={{ width: `${p.strength * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
