export default function HowItWorks() {
  return (
    <div className="min-h-[70vh]">

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          How WarmConnect AI Works
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl">
          WarmConnect AI models professional networks as weighted graphs and
          ranks multi-hop introduction paths based on relationship strength.
        </p>
      </div>

      <div className="space-y-10">

        <Section
          title="1. Network Graph Construction"
          description="Each user is modeled as a node. Professional connections form weighted edges in a dynamic graph structure."
        />

        <Section
          title="2. Relationship Strength Engine"
          description="Connections are scored using interaction frequency, recency decay, shared company, shared education, and mutual follows."
        />

        <Section
          title="3. Multi-Hop Path Discovery"
          description="The system searches up to 3 degrees of separation to find potential introduction chains."
        />

        <Section
          title="4. Path Ranking & Filtering"
          description="Paths are ranked using a weakest-link principle with length penalties to prioritize the strongest and most trustworthy introductions."
        />

      </div>

    </div>
  )
}

type SectionProps = {
  title: string
  description: string
}

function Section({ title, description }: SectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-semibold text-slate-900 mb-3">
        {title}
      </h2>
      <p className="text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
