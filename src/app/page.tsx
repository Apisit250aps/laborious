'use client'

import CardContent from '@/components/share/layouts/CardContent'
import { useCallback, useState } from 'react'
import { useGameStore } from '@/stores/game'
import { Card } from '@/types/card'
import GameLayout from '@/components/share/layouts/GameLayout'

export default function Home() {

  const { robinsonCard, trash, score, drawCard, setDrawPoint } =
    useGameStore()

  const [currentCard, setCurrentCard] = useState<Card | null>(null)
 
  
  const handleDrawCard = () => {
    const card = drawCard()
    if (card) {
      setCurrentCard(card)
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
          {/* ปัจจุบันที่จั่วได้ */}
          {currentCard && (
            <div className="chat chat-end mb-4">
              <div className="chat-bubble">
                <strong>คุณจั่วได้:</strong> {currentCard.title}{' '}
                {currentCard.actionData?.title} ({currentCard.score || 0})
              </div>
            </div>
          )}
          {/* กองที่เหลือ */}
          <div className="mb-4">
            <h2 className="font-bold">
              Robinson Deck ({robinsonCard.length} cards left)
            </h2>
            <ul className="list-disc list-inside">
              {robinsonCard.map((c, i) => (
                <li key={i}>
                  {c.title} {c.actionData?.title} ({c.score || 0})
                </li>
              ))}
            </ul>
          </div>

          {/* การ์ดที่ทิ้งแล้ว */}
          <div>
            <h2 className="font-bold">Trash ({trash.length})</h2>
            <ul className="list-decimal list-inside">
              {trash.map((c, i) => (
                <li key={i}>
                  {c.title} {c.actionData?.title} ({c.score || 0})
                </li>
              ))}
            </ul>
          </div>
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
