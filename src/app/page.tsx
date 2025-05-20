'use client'

import ChatLogs from '@/components/app/chat-logs'
import AdventureButton from '@/components/app/game/adventure-button'
import DrawButton from '@/components/app/game/draw-button'
import DataTable from '@/components/share/table/DataTable'
import { openModal } from '@/libs/utils'
import { useGameStore } from '@/stores/game'
import { Card } from '@/types/card'
import { ColumnDef } from '@tanstack/react-table'
import React, { useCallback, useEffect, useState } from 'react'

const columns: ColumnDef<Card>[] = [
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'type',
    header: 'Type'
  },
  {
    accessorKey: 'pick',
    header: 'Pick'
  },
  {
    accessorKey: 'danger',
    header: 'Danger'
  },
  {
    accessorKey: 'score',
    header: 'Score'
  },
  {
    accessorKey: 'actionData',
    header: 'Action',
    cell: ({ row }) => <>{row.original.actionData?.title}</>
  },
  {
    accessorKey: 'token',
    header: 'Token'
  },
  {
    accessorKey: 'level',
    header: 'Level'
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity'
  }
]

export default function App() {
  const {
    health,
    drawPoint,
    round,
    dangerScore,
    attackScore,
    robinsonCard,
    knowledgeCard,
    dangerCard,
    ageCard,
    onDeck,
    onDestroy,
    onGraveyard,
    //
    onDraw,
    //
    setup,
    save,
    reset
  } = useGameStore()

  const [cardInfo, setCardInfo] = useState<Card[]>([])

  const onInit = useCallback(async () => {
    await setup()
  }, [setup])

  const Info = useCallback((cards: Card[]) => {
    setCardInfo(cards)
    openModal('show-card')
  }, [])

  useEffect(() => {
    onInit()
  }, [onInit])

  useEffect(() => {
    // สร้าง subscription เพื่อดักฟังการเปลี่ยนแปลงของค่าใน store
    const unsub = useGameStore.subscribe(() => {
      save()
      return true
    })

    return () => unsub()
  }, [save])

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content max-h-screen">
          {/* navbar */}
          <nav className="navbar sticky top">
            <div className="flex-1 ">
              <label
                htmlFor="my-drawer-2"
                className="btn btn-ghost drawer-button lg:hidden "
              >
                <i className="ri-menu-2-line"></i>
              </label>
            </div>
            <div className="flex-none">
              <ul className="menu menu-horizontal">
                <li>
                  <a>
                    <i className="ri-skull-2-line"></i>
                    {dangerScore()}
                  </a>
                </li>
                <li>
                  <a>
                    <i className="ri-time-line"></i>
                    {round}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          {/* contents */}
          <main className="h-[calc(100vh-64px)] overflow-y-auto px-3 py-2">
            <ChatLogs />
            <footer className="flex flex-col lg:flex-row gap-2 px-3 py-2 sticky bottom-0">
              <div className="flex-none">
                <ul className="menu menu-horizontal">
                  <li>
                    <a>
                      <i className="ri-poker-hearts-fill text-error"></i>
                      {health}
                    </a>
                  </li>
                  <li>
                    <a>
                      <i className="ri-sword-line"></i>
                      {attackScore()}
                    </a>
                  </li>
                  <li>
                    <a>
                      <i className="ri-dice-line"></i>
                      {drawPoint}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex space-x-2 justify-end w-full">
                {onDraw ? <DrawButton /> : <AdventureButton />}
              </div>
            </footer>
          </main>
          <dialog id="show-card" className="modal">
            <div className="modal-box w-11/12 max-w-5xl max-h-96">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg ">Card information!</h3>
              <DataTable
                data={cardInfo || []}
                loading={false}
                columns={columns}
              />
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <a>Game</a>
            </li>
            <li>
              <h2 className="menu-title">Cards</h2>
              <ul>
                <li>
                  <a onClick={() => Info(robinsonCard)}>
                    <i className="ri-boxing-line"></i> Robinson{' '}
                    <div className="badge badge-soft badge-success">
                      {robinsonCard.length}
                    </div>
                  </a>
                </li>
                <li>
                  <a onClick={() => Info(knowledgeCard)}>
                    <i className="ri-graduation-cap-line"></i> Knowledge{' '}
                    <div className="badge badge-soft badge-info">
                      {knowledgeCard.length}
                    </div>
                  </a>
                </li>
                <li>
                  <a onClick={() => Info(dangerCard)}>
                    <i className="ri-skull-line"></i>Dangerous{' '}
                    <div className="badge badge-soft badge-error">
                      {dangerCard.length}
                    </div>
                  </a>
                </li>
                <li>
                  <a onClick={() => Info(ageCard)}>
                    <i className="ri-calendar-close-line"></i>Age{' '}
                    <div className="badge badge-soft badge-warning">
                      {ageCard.length}
                    </div>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <h2 className="menu-title">Experience</h2>
              <ul>
                <li>
                  <a onClick={() => Info(onDeck)}>
                    <i className="ri-stack-line"></i>Deck{' '}
                    <div className="badge badge-soft badge-warning">
                      {onDeck.length}
                    </div>
                  </a>
                </li>
                <li>
                  <a onClick={() => Info(onDestroy)}>
                    <i className="ri-delete-bin-2-line"></i>Destroyed{' '}
                    <div className="badge badge-soft badge-warning">
                      {onDestroy.length}
                    </div>
                  </a>
                </li>
                <li>
                  <a onClick={() => Info(onGraveyard)}>
                    <i className="ri-cross-line"></i>Graveyard{' '}
                    <div className="badge badge-soft badge-warning">
                      {onGraveyard.length}
                    </div>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a onClick={reset}>Reset</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
