"use client"

import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  MarkerType
} from "reactflow"
import "reactflow/dist/style.css"

type User = {
  id: string
  name: string
}

type Props = {
  path: string[]
  users: User[]
  edgeStrengths: number[]
}

export default function PathGraph({ path, users, edgeStrengths }: Props) {

  const nodes: Node[] = path.map((id, index) => {
    const user = users.find(u => u.id === id)

    return {
      id,
      position: { x: index * 260, y: 120 },
      data: { label: user?.name || id },
      style: {
        padding: "12px 18px",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        background: "white",
        fontWeight: 600,
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
      }
    }
  })

  const edges: Edge[] = path.slice(0, -1).map((nodeId, index) => {
    const strength = edgeStrengths[index] || 0

    return {
      id: `e-${nodeId}-${path[index + 1]}`,
      source: nodeId,
      target: path[index + 1],
      label: strength.toFixed(2),
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        stroke: "#6366f1",
        strokeWidth: 2 + strength * 4, // thickness scales with strength
      },
      labelStyle: {
        fill: "#6366f1",
        fontWeight: 600,
      },
      labelBgStyle: {
        fill: "#eef2ff",
        rx: 6,
        ry: 6,
      }
    }
  })

  return (
    <div className="h-[420px] w-full bg-white rounded-xl border border-slate-200 shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#f1f5f9" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
