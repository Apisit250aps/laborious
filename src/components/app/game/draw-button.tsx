'use client'
import React, { useCallback } from 'react'
import HandCard from './hand-card'
import { ChatLogs, Danger, useGameStore } from '@/stores/game'
import Swal from 'sweetalert2'

export default function DrawButton() {
  const {
    drawCard,
    setChat,
    drawPoint,
    dangerSelected,
    setHealth,
    setDrawPoint,
    setFight,
    setWhiteFlag,
    attackScore,
    dangerScore,
    setEndRound,
    ageCardAction
  } = useGameStore()

  const handleEndRound = useCallback(
    (giveUp: boolean) => {
      if (!dangerSelected) return
      if (giveUp) {
        setWhiteFlag(dangerSelected as Danger)
      } else {
        setFight(dangerSelected as Danger)
      }
      setEndRound()
    },
    [dangerSelected, setFight, setWhiteFlag, setEndRound]
  )
  const notifyDraw = useCallback(
    (cardTitle?: string) => {
      if (!cardTitle) return
      setChat({
        role: 'player',
        message: `จั่วได้ ${cardTitle}`,
        send: new Date()
      } as ChatLogs)
    },
    [setChat]
  )
  const drawAction = useCallback(() => {
    const card = drawCard()
    notifyDraw(card?.title)

    if (card?.type == 'AGE') {
      ageCardAction(card)
    }
  }, [ageCardAction, drawCard, notifyDraw])

  const onDrawCard = useCallback(async () => {
    if (drawPoint > 0) {
      drawAction()
      return
    }

    const result = await Swal.fire({
      title: 'แต้มจั่วการ์ดไม่พอ!',
      text: 'คุณจะยอมเสียเลือด 1 แต้มเพื่อจั่ว',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยินยอม'
    })

    if (result.isConfirmed) {
      setHealth(-1)
      setDrawPoint(1)

      setChat({
        role: 'player',
        message: 'บาดเจ็บ เลือด -1',
        send: new Date()
      })
      drawAction()
    }
  }, [drawPoint, drawAction, setHealth, setDrawPoint, setChat])

  const canAttack = drawPoint <= 0 && attackScore() >= dangerScore()
  const canGiveUp = drawPoint <= 0 && attackScore() < dangerScore()

  return (
    <>
      <HandCard />

      {canGiveUp && (
        <button className="btn" onClick={() => handleEndRound(true)}>
          <i className="ri-flag-line"></i>ยอมแพ้
        </button>
      )}

      {canAttack && (
        <button className="btn" onClick={() => handleEndRound(false)}>
          <i className="ri-flag-line"></i>ต่อสู้
        </button>
      )}

      <button className="btn" onClick={onDrawCard}>
        <i className="ri-fire-line"></i>จั่วการ์ด
      </button>
    </>
  )
}
