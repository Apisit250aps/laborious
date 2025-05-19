'use client'
import React, { useCallback } from 'react'
import HandCard from './hand-card'
import { useGameStore } from '@/stores/game'
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
    score,
    dangerScore,
    setEndRound
  } = useGameStore()

  const Attack = useCallback(() => {
    setFight(dangerSelected)
    setEndRound()
  }, [dangerSelected, setEndRound, setFight])

  const giveUp = useCallback(() => {
    setWhiteFlag(dangerSelected)
    setEndRound()
  }, [dangerSelected, setEndRound, setWhiteFlag])

  const onDrawCard = useCallback(async () => {
    if (drawPoint > 0) {
      const card = drawCard()
      setChat({
        role: 'player',
        message: `จั่วได้ ${card?.title}`,
        send: new Date()
      })
    } else {
      Swal.fire({
        title: 'แต้มจั่วการ์ดไม่พอ!',
        text: 'คุณจะยอมเสียเลือด 1 แต้มเพื่อจั่ว',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยินยอม'
      }).then((result) => {
        if (result.isConfirmed) {
          setHealth(-1)
          setDrawPoint(1)
          const card = drawCard()
          setChat({
            role: 'player',
            message: `บาดเจ็บ เลือด -1`,
            send: new Date()
          })
          setChat({
            role: 'player',
            message: `จั่วได้ ${card?.title}`,
            send: new Date()
          })
        }
      })
    }
  }, [drawCard, drawPoint, setChat, setDrawPoint, setHealth])

  return (
    <>
      <HandCard />
      {score() < dangerScore ? (
        <button className="btn" onClick={giveUp}>
          <i className="ri-flag-line"></i>ยอมแพ้
        </button>
      ) : (
        <button className="btn" onClick={Attack}>
          <i className="ri-flag-line"></i>ต่อสู้
        </button>
      )}
      <button className="btn" onClick={onDrawCard}>
        <i className="ri-fire-line"></i>จั่วการ์ด
      </button>
    </>
  )
}
