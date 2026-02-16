import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center">

      {/* Hero Section */}
      <section className="text-center py-20">

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Discover the Strongest  
          <span className="text-indigo-600"> Introduction Path</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          WarmConnect AI uses graph-based relationship intelligence to analyze
          multi-hop professional networks and surface the most reliable
          warm introduction paths.
        </p>

        <Link
          href="/select-profile"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-md transition duration-200"
        >
          Launch Explorer
        </Link>

      </section>

      {/* Feature Section */}
      <section className="grid md:grid-cols-3 gap-10 mt-16">

        <FeatureCard
          title="Graph Intelligence"
          description="Multi-hop path discovery using weighted graph traversal algorithms."
        />

        <FeatureCard
          title="Strength Modeling"
          description="Connections are scored using interaction intensity, recency decay, and shared context."
        />

        <FeatureCard
          title="Ranked Introductions"
          description="Paths are sorted by strength and length to prioritize the most trustworthy route."
        />

      </section>

    </div>
  )
}

type FeatureCardProps = {
  title: string
  description: string
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-200">
      <h3 className="font-semibold text-lg mb-3 text-slate-900">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
