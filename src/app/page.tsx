'use client'

import CardContent from '@/components/share/layouts/CardContent'
import { useActionStore } from '@/stores/action'
import { useCardStore } from '@/stores/card'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/stores/game'
import { Card } from '@/types/card'

export default function Home() {
  const { loadCards, cards } = useCardStore()
  const { loadActions } = useActionStore()
  const { robinsonCard, trash, score, setup, drawCard } = useGameStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const initialized = useRef(false)

  const onInit = useCallback(async () => {
    if (initialized.current) return
    setLoading(true)
    try {
      await Promise.all([loadActions(), loadCards()])
      setup(cards)
      initialized.current = true
    } catch (error) {
      setError(error as string)
    } finally {
      setLoading(false)
    }
  }, [cards, loadActions, loadCards, setup])

  const handleDrawCard = () => {
    const card = drawCard()
    if (card) {
      setCurrentCard(card)
    } else {
      alert('No cards left to draw!')
    }
  }

  useEffect(() => {
    onInit()
  }, [onInit])

  if (loading)
    return (
      <CardContent title="Game">
        <p>Loading...</p>
      </CardContent>
    )
  if (error)
    return (
      <CardContent title="Game">
        <p>Error: {error}</p>
      </CardContent>
    )

  return (
    <>
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
    </>
  )
}
