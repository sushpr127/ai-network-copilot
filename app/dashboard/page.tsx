"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

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
    <div className="min-h-[70vh]">

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Welcome back, <span className="text-indigo-600">{user.name}</span>
        </h1>

        <p className="text-slate-600 text-lg">
          Analyze your network and uncover high-confidence introduction paths.
        </p>
      </div>

      {/* 🔥 Network Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-14">
        <StatCard label="Total Connections" value="48" />
        <StatCard label="Strong Connections" value="12" />
        <StatCard label="Max Path Depth" value="3" />
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-8">

        <DashboardCard
          title="Explore Introduction Paths"
          description="Discover the strongest multi-hop paths across your professional network."
          link="/explorer"
          primary
        />

        <DashboardCard
          title="Understand the Algorithm"
          description="See how relationship strength and path ranking are calculated."
          link="/how-it-works"
        />

      </div>

      {/* Logout Section */}
      <div className="mt-16">
        <button
          onClick={logout}
          className="text-slate-500 hover:text-indigo-600 transition"
        >
          Logout
        </button>
      </div>

    </div>
  )
}

/* ============================= */
/*           Stat Card           */
/* ============================= */

type StatCardProps = {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200">
      <p className="text-sm text-slate-500 mb-2">
        {label}
      </p>
      <p className="text-2xl font-bold text-indigo-600">
        {value}
      </p>
    </div>
  )
}

/* ============================= */
/*        Dashboard Card         */
/* ============================= */

type DashboardCardProps = {
  title: string
  description: string
  link: string
  primary?: boolean
}

function DashboardCard({
  title,
  description,
  link,
  primary = false,
}: DashboardCardProps) {
  return (
    <Link href={link}>
      <div
        className={`p-8 rounded-2xl border transition duration-200 cursor-pointer ${
          primary
            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg hover:bg-indigo-700"
            : "bg-white text-slate-900 border-slate-200 shadow-sm hover:shadow-md"
        }`}
      >
        <h3 className="font-semibold text-lg mb-3">
          {title}
        </h3>
        <p className={primary ? "text-indigo-100" : "text-slate-600"}>
          {description}
        </p>
      </div>
    </Link>
  )
}
