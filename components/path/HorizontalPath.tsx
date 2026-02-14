"use client"

import { motion } from "framer-motion"
import UserChip from "@/components/UserChip"

type User = {
  id: string
  name: string
  job_title?: string
  industry?: string
}

type Props = {
  path: string[]
  users: User[]
}

export default function HorizontalPath({ path, users }: Props) {
  return (
    <div className="flex items-center space-x-8 overflow-x-auto py-6">
      {path.map((nodeId, index) => {
        const user = users.find(u => u.id === nodeId)
        if (!user) return null

        return (
          <motion.div
            key={nodeId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="flex items-center space-x-8"
          >
            <UserChip user={user} />

            {index < path.length - 1 && (
              <div className="text-gray-400 text-3xl font-light">
                →
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
