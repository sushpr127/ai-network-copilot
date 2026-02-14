import Link from "next/link"

export default function Home() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl font-bold mb-6 text-gray-900">
        WarmConnect AI
      </h1>

      <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
        Intelligent multi-hop introduction discovery powered by graph-based 
        relationship strength modeling. Discover the strongest path 
        between professionals in your network.
      </p>

      <Link
        href="/explorer"
        className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition"
      >
        Launch Path Explorer
      </Link>
    </div>
  )
}
