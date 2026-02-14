import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 antialiased">

        <AuthProvider>

          {/* Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="relative">
            <div className="max-w-7xl mx-auto px-6 py-12">
              {children}
            </div>
          </main>

        </AuthProvider>

      </body>
    </html>
  )
}
