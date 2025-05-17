'use client'

import CardContent from '@/components/share/layouts/CardContent'
import GameLayout from '@/components/share/layouts/GameLayout'
import DrawButton from '@/components/app/draw-button'
import PlayButton from '@/components/app/play-button'
import { useGameStore } from '@/stores/game'

export default function Home() {
  const { onDraw, chatLogs } = useGameStore()
  return (
    <>
      <GameLayout>
        <CardContent title="Game">
          <main className="min-h-96">
            {chatLogs.map((chat, index) => (
              <div
                key={index}
                className={`chat ${
                  chat.role === 'system' ? 'chat-start' : 'chat-end'
                }`}
              >
                <div className="chat-bubble">{chat.message}</div>
                <div className="chat-footer opacity-50">Seen</div>
              </div>
            ))}
          </main>
        </CardContent>
        {onDraw ? <DrawButton /> : <PlayButton />}
      </GameLayout>
    </>
  )
}
