'use client'

import CardContent from '@/components/share/layouts/CardContent'
import GameLayout from '@/components/share/layouts/GameLayout'
import DrawButton from '@/components/app/draw-button'
import PlayButton from '@/components/app/play-button'
import { useGameStore } from '@/stores/game'

export default function Home() {
  const { onDraw } = useGameStore()
  return (
    <>
      <GameLayout>
        <CardContent title="Game">
          <main className="min-h-96"></main>
        </CardContent>
        {onDraw ? <DrawButton /> : <PlayButton />}
      </GameLayout>
    </>
  )
}
