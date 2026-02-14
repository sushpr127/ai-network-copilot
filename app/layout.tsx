import "./globals.css"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-700">
              WarmConnect AI
            </Link>

            <div className="space-x-6 text-sm font-medium">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <Link href="/explorer" className="hover:text-blue-600">
                Explorer
              </Link>
              <Link href="/how-it-works" className="hover:text-blue-600">
                How It Works
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-6xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  )
}
