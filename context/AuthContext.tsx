"use client"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
}

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("mockUser")
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const login = (user: User) => {
    setUser(user)
    localStorage.setItem("mockUser", JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mockUser")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
