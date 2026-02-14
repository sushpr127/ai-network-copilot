"use client"

import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge
} from "reactflow"
import "reactflow/dist/style.css"

type User = {
  id: string
  name: string
}

type Props = {
  path: string[]
  users: User[]
}

export default function PathGraph({ path, users }: Props) {
  const nodes: Node[] = path.map((id, index) => {
    const user = users.find(u => u.id === id)

    return {
      id,
      position: { x: index * 250, y: 100 },
      data: { label: user?.name || id },
      style: {
        padding: 10,
        borderRadius: 10,
        border: "1px solid #ddd"
      }
    }
  })

  const edges: Edge[] = path.slice(1).map((id, index) => ({
    id: `e${index}`,
    source: path[index],
    target: id,
    animated: true
  }))

  return (
    <div className="h-64 w-full bg-white rounded-xl border border-gray-200">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
