"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

type User = {
  id: string
  name: string
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

  const handleSelect = (user: User) => {
    login(user)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">
        Select Your Profile
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleSelect(user)}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg cursor-pointer transition"
          >
            <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              {user.name.charAt(0)}
            </div>

            <p className="text-center font-medium">
              {user.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
