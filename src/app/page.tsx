'use client'

import CardContent from '@/components/share/layouts/CardContent'
import GameLayout from '@/components/share/layouts/GameLayout'
import DrawButton from '@/components/app/draw-button'
import PlayButton from '@/components/app/play-button'
import { useGameStore } from '@/stores/game'
import HandButton from '@/components/app/hand-button'

export default function Home() {
  const { onDraw, chatLogs, dangerScore, drawPoint } = useGameStore()
  return (
    <>
      <GameLayout>
        <CardContent title="Game">
          <main className="max-h-100 min-h-100 overflow-y-auto">
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
        <div className="px-3 flex justify-end">
          {onDraw ? (
            <>
              <div className="space-x-3">
                <HandButton />

                {dangerScore > 0 ? (
                  <>
                    <button className="btn">ยอมแพั</button>
                    {drawPoint > 0 ? (
                      <>
                        <DrawButton />
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <>
                    <button className="btn">ต่อสู้</button>
                  </>
                )}
              </div>
            </>
          ) : (
            <PlayButton />
          )}
        </div>
      </GameLayout>
    </>
  )
}
