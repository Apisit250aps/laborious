'use client'

import CardContent from '@/components/share/layouts/CardContent'
import { useCallback } from 'react'
import { useGameStore } from '@/stores/game'
import { Card } from '@/types/card'
import GameLayout from '@/components/share/layouts/GameLayout'

export default function Home() {
  const { score, drawCard, setDrawPoint } = useGameStore()

  const handleDrawCard = () => {
    const card = drawCard()
    if (card) {
      gameRule(card)
    } else {
      alert('No cards left to draw!')
    }
  }

  const gameRule = useCallback(
    (card: Card) => {
      console.log(card.type)
      if (card.type !== 'DANGER') {
        setDrawPoint(card.score!)
      }
      if (['KNOWLEDGE', 'ROBINSON', 'AGE'].includes(card.type)) {
        const action = card.actionData!
        console.log(action)
      }
    },
    [setDrawPoint]
  )

  return (
    <>
      <GameLayout>
        <CardContent title="Game">
          <main className="min-h-96">
            
          </main>
        </CardContent>
        <button
          className="btn btn-outline absolute bottom-4 right-4"
          onClick={handleDrawCard}
        >
          Draw Card {score()}
        </button>
      </GameLayout>
    </>
  )
}
