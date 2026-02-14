type User = {
  id: string
  name: string
  job_title?: string
  industry?: string
}

type Props = {
  user: User
}

export default function UserChip({ user }: Props) {
  return (
    <div className="flex items-center bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3 min-w-[220px] hover:shadow-md transition duration-200">
      
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mr-4">
        {user.name?.charAt(0) || "?"}
      </div>

      {/* User Info */}
      <div>
        <div className="font-semibold text-gray-900">
          {user.name}
        </div>

        {(user.job_title || user.industry) && (
          <div className="text-sm text-gray-500">
            {user.job_title ?? ""}
            {user.job_title && user.industry && " • "}
            {user.industry ?? ""}
          </div>
        )}
      </div>
    </div>
  )
}
