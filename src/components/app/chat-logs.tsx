'use client'

import { useGameStore } from '@/stores/game'

export default function ChatLogs() {
  const { chatLogs } = useGameStore()
  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // ถ้าอยากได้แบบ 24 ชั่วโมง เช่น 14:30
    })
  }
  return (
    <>
      {chatLogs.map((chat, index) => (
        <div
          key={index}
          className={`chat ${
            chat.role == 'system' ? 'chat-start' : 'chat-end'
          }`}
        >
          <div className="chat-header">
            {chat.role.toUpperCase()}
            <time className="text-xs opacity-50">
              {formatTime(chat.send)}
            </time>
          </div>
          <div className="chat-bubble">{chat.message}</div>
        </div>
      ))}
    </>
  )
}
