import { useGameStore } from '@/stores/game'
import { Card } from '@/types/card'
import { useCallback } from 'react'

export default function DrawButton() {
  const { score, drawCard, drawPoint, addChat } = useGameStore()
  const handleDrawCard = () => {
    if (drawPoint <= 0) return

    const card = drawCard()
    if (card) {
      addChat({
        role: 'player',
        message: `จั่วได้ ${card.title}`,
        send: new Date()
      })
      gameRule(card)
    } else {
      alert('No cards left to draw!')
    }
  }

  const gameRule = useCallback((card: Card) => {
    console.log(card.type)
    if (['KNOWLEDGE', 'ROBINSON', 'AGE'].includes(card.type)) {
      const action = card.actionData!
      console.log(action)
    }
  }, [])

  return (
    <button
      className="btn btn-outline absolute bottom-4 right-4"
      onClick={handleDrawCard}
    >
      Draw Card {score()}
    </button>
  )
}
