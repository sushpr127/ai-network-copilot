"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

type User = {
  id: string
  name: string
  job_title?: string
  industry?: string
}

export default function SelectProfilePage() {
  const [users, setUsers] = useState<User[]>([])
  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/test")
      const data = await res.json()
      setUsers(data)
    }
    fetchUsers()
  }, [])

  function handleSelect(user: User) {
    login(user)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Select Your Profile
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a professional identity to explore your network intelligence.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleSelect(user)}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 cursor-pointer p-6 text-center group"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold mb-4 group-hover:scale-110 transition">
              {user.name.charAt(0)}
            </div>

            <h3 className="font-semibold text-lg">
              {user.name}
            </h3>

            <p className="text-sm text-gray-500">
              {user.job_title || "Professional"}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {user.industry}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
