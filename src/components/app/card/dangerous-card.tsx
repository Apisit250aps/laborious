import { Danger, useGameStore } from '@/stores/game'
import React from 'react'

export default function DangerousCard({
  danger,
  index,
  onSelect
}: {
  danger: Danger
  index: number
  onSelect: (danger: Danger) => void
}) {
  const { field } = useGameStore()
  const getFieldColor = () => {
    if (field == 0) {
      return 'badge-success'
    } else if (field == 1) {
      return 'badge-warning'
    }
    return 'badge-danger'
  }

  const selected = (danger: Danger) => {
    onSelect(danger)
  }

  return (
    <div className="card bg-base-100 shadow transition-shadow duration-300">
      <div className="card-body p-6">
        {/* Header with badge */}
        <div className="flex justify-between items-center mb-4">
          <span className={`badge ${getFieldColor()} badge-sm`}>อันตราย</span>
          <div className="text-xs text-base-content/60">#{index + 1}</div>
        </div>

        {/* Title */}
        <h2 className="card-title text-l font-bold mb-4 line-clamp-2">
          {danger.danger.title}
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
            <i className="ri-sword-line text-error text-lg"></i>
            <span className="text-sm font-medium">
              {danger.danger.danger![field]}
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
            <i className="ri-dice-line text-warning text-lg"></i>
            <span className="text-sm font-medium">{danger.danger.pick}</span>
          </div>
        </div>

        <div className="divider my-4"></div>
        <div className="h2">{danger.knowledge.title}</div>
        {/* Knowledge section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <i className="ri-fire-fill text-orange-500"></i>
            <span className="text-sm">
              <span className="font-medium">คะแนน:</span>{' '}
              {danger.knowledge.score}
            </span>
          </div>

          {danger.knowledge.actionData?.title && (
            <div className="flex items-center gap-3">
              <i className="ri-lightbulb-flash-fill text-yellow-500"></i>
              <span className="text-sm line-clamp-1">
                {danger.knowledge.actionData.title}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <i className="ri-poker-diamonds-line text-purple-500"></i>
            <span className="text-sm">
              <span className="font-medium">Token:</span>{' '}
              {danger.knowledge.token}
            </span>
          </div>
        </div>

        {/* Subscribe button */}
        <div className="mt-6">
          <button
            onClick={() => selected(danger)}
            className="btn btn-outline w-full"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  )
}
