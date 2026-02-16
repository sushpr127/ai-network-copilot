"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

type Connection = {
  id: string
  name: string
  job_title?: string
  industry?: string
  strength?: number
}

export default function ConnectionsPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/select-profile")
      return
    }

    async function fetchConnections(userId: string) {
      try {
        const res = await fetch(
          `/api/my-connections?userId=${userId}`
        )

        if (!res.ok) {
          throw new Error("Failed to fetch connections")
        }

        const data = await res.json()

        setConnections(data.connections || [])
      } catch (err) {
        console.error("Connection fetch error:", err)
        setError("Failed to load connections.")
      } finally {
        setLoading(false)
      }
    }

    fetchConnections(user.id)
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Your Connections
        </h1>

        {loading && (
          <p className="text-slate-500">
            Loading connections...
          </p>
        )}

        {!loading && error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && connections.length === 0 && (
          <p className="text-slate-500">
            You have no connections yet.
          </p>
        )}

        {!loading && !error && connections.length > 0 && (
          <div className="space-y-6">
            {connections.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {c.name}
                  </h3>

                  {c.job_title && (
                    <p className="text-slate-500 text-sm">
                      {c.job_title}
                    </p>
                  )}

                  {c.industry && (
                    <p className="text-slate-400 text-xs">
                      {c.industry}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {c.strength !== undefined
                      ? c.strength.toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
