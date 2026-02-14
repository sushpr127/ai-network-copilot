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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 px-6">

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Select Your Profile
        </h1>

        <p className="text-slate-600 text-lg">
          Choose a professional identity to explore your network intelligence.
        </p>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleSelect(user)}
            className="
              bg-white 
              border border-slate-200 
              rounded-2xl 
              shadow-sm 
              hover:shadow-xl 
              hover:border-indigo-300
              transition-all duration-300 
              cursor-pointer 
              p-8 
              text-center 
              group
            "
          >
            {/* Avatar */}
            <div className="
              w-20 h-20 mx-auto rounded-full 
              bg-indigo-600 
              flex items-center justify-center 
              text-white text-2xl font-semibold 
              mb-6 
              group-hover:scale-110 
              group-hover:bg-indigo-700
              transition-all duration-300
            ">
              {user.name.charAt(0)}
            </div>

            {/* Name */}
            <h3 className="font-semibold text-lg text-slate-900 mb-2">
              {user.name}
            </h3>

            {/* Job Title */}
            <p className="text-sm text-slate-600 font-medium">
              {user.job_title || "Professional"}
            </p>

            {/* Industry */}
            {user.industry && (
              <p className="text-xs text-slate-500 mt-1">
                {user.industry}
              </p>
            )}

          </div>
        ))}
      </div>

    </div>
  )
}
