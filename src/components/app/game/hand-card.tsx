'use client'
import { openModal } from '@/libs/utils'
import { useGameStore } from '@/stores/game'
import type { HandCard } from '@/stores/game'
import React from 'react'

export default function HandCard() {
  const { onHand, setHealth, setHandCard } = useGameStore()
  const cardAction = (card: HandCard) => {
    if (!card.isActive) return
    const { codex, value } = card.actionData!
    switch (codex) {
      case 'HP':
        setHealth(value)
        break
      default:
        break
    }
    const newHand = onHand.map((c) => {
      if (c.id == card.id) {
        return { ...c, isActive: false }
      }
      return c
    })
    setHandCard(newHand)
  }
  return (
    <>
      <button className="btn" onClick={() => openModal('on-hand-cards')}>
        <i className="ri-hand"></i>บนมือ
      </button>
      <dialog id="on-hand-cards" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">การ์ดที่อยู่บนมือ</h3>
          <ul className="list bg-base-100 rounded-box">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              สามารถใช้ความสามารถได้
            </li>
            {onHand.map((robin, index) => (
              <li key={index} className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">
                  {robin.score}
                </div>
                <div className="list-col-grow">
                  <div>
                    {robin.title} #{robin.id + 1}
                  </div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {robin.type}
                  </div>
                  <span className="badge badge-soft badge-warning">
                    {robin.actionData!.title}
                  </span>{' '}
                </div>
                <button
                  className="btn btn-square btn-ghost"
                  onClick={() => cardAction(robin!)}
                  disabled={!robin.isActive}
                >
                  <svg
                    className="size-[1.2em]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M6 3L20 12 6 21 6 3z"></path>
                    </g>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  )
}
