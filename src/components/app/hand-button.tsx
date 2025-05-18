import React from 'react'
import Modals, { openModal } from '../share/button/Modals'
import { useGameStore } from '@/stores/game'

export default function HandButton() {
  const { onHand } = useGameStore()
  return (
    <>
      <Modals id={'on-hand'}>
        <ul className="list bg-base-100 rounded-box">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            Most played songs this week
          </li>
          {onHand.map((card, index) => (
            <li className="list-row" key={index}>
              <div className="text-4xl font-thin opacity-30 tabular-nums">
                {card.score}
              </div>
              <div>
              </div>
              <div className="list-col-grow">
                <div>{card.title}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {card.actionData?.title}
                </div>
              </div>
              <button className="btn btn-square btn-ghost">
                <i className="ri-play-line"></i>
              </button>
            </li>
          ))}
        </ul>
      </Modals>
      <button
        className="btn btn-outline btn-warning"
        onClick={() => openModal('on-hand')}
      >
        การ์ดบนมือ
      </button>
    </>
  )
}
