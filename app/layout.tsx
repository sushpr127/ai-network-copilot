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
      <body className="bg-slate-50 text-slate-900">


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
