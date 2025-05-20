'use client'
import { openModal } from '@/libs/utils'
import { Danger, useGameStore } from '@/stores/game'
import React, { useCallback, useState } from 'react'

export default function AdventureButton() {
  const { adventureCard, setChat, field, setDanger } = useGameStore()
  const [danger, optionDanger] = useState<Danger[]>([])
  const adventure = useCallback(() => {
    setChat({
      role: 'system',
      message: 'อันตราย',
      send: new Date(),
      type: 'warning'
    })
    const result = adventureCard()
    optionDanger(result)
    openModal('adventure')
  }, [adventureCard, setChat])

  const selectDanger = (selected: Danger) => {
    setDanger(selected, danger)
    setChat({
      role: 'system',
      message: `เผชิญหน้ากับ ${selected.danger.title}`,
      send: new Date(),
      type: 'error'
    })
    setChat({
      role: 'system',
      message: `ค่าอันตราย ${selected.danger.danger![field]}`,
      send: new Date(),
      type: 'warning'
    })
    setChat({
      role: 'system',
      message: `จั่วการ์ด ${selected.danger.pick} ใบ`,
      send: new Date(),
      type: 'info'
    })
  }

  return (
    <>
      <button
        onClick={adventure}
        className="btn btn-outline btn-neutral w-full lg:w-auto"
      >
        เริ่มต้นการผจญภัย
      </button>
      <dialog id="adventure" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">ภัยอันตราย</h3>
          <ul className="list bg-base-100 rounded-box">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              เลือกเผชิญหน้ากับอันตราย
            </li>
            {danger.map((adv, index) => (
              <li key={index} className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">
                  {index + 1}
                </div>
                <div>
                  <h1>{adv.danger.title}</h1>
                  <div className=" flex space-x-1">
                    <a className="badge badge-error">
                      <i className="ri-skull-fill"></i>
                      {adv.danger.danger![field]}
                    </a>
                    <a className="badge badge-warning">
                      <i className="ri-dice-fill"></i>
                      {adv.danger.pick}
                    </a>
                  </div>
                </div>
                <div className="list-col-wrap">
                  <h1>{adv.knowledge.title}</h1>
                  <div className="flex space-x-1">
                    <div className="badge badge-success">
                      {adv.knowledge.actionData?.title}
                    </div>
                    <div className="badge badge-success">
                      <i className="ri-fire-line"></i>
                      {adv.knowledge.score}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-square btn-ghost"
                  onClick={() => selectDanger(adv)}
                >
                  <i className="ri-sword-line"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  )
}
