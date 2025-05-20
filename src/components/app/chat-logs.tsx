'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/game'

export default function ChatLogs() {
  const { chatLogs } = useGameStore()

  const endRef = useRef<HTMLDivElement | null>(null)

  // เลื่อนไปล่างสุดเมื่อ chatLogs เปลี่ยน
  useEffect(() => {
    if (chatLogs.length > 5) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatLogs])

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <>
      <div className="overflow-y-auto px-2 h-full">
        {chatLogs.map((chat, index) => (
          <div
            key={index}
            className={`chat ${
              chat.role === 'system' ? 'chat-start' : 'chat-end'
            }`}
          >
            <div className="chat-header">
              {chat.role.toUpperCase()}
              <time className="text-xs opacity-50 ml-2">
                {formatTime(chat.send)}
              </time>
            </div>
            <div className={`chat-bubble ` + `chat-bubble-${chat.type!}`}>
              {chat.message}
            </div>
          </div>
        ))}
        <div ref={endRef} /> {/* จุด scroll-to-bottom */}
      </div>
    </>
  )
}
