'use client'
import { useGameStore } from '@/stores/game'
import React, { useCallback, useEffect } from 'react'

export default function App() {
  const {
    health,
    setup,
    robinsonCard,
    knowledgeCard,
    dangerCard,
    ageCard,
    onDeck,
    onDestroy,
    onGraveyard
  } = useGameStore()

  const onInit = useCallback(async () => {
    await setup()
  }, [setup])

  useEffect(() => {
    onInit()
  }, [onInit])

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content max-h-screen">
          {/* navbar */}
          <nav className="navbar">
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
                    <i className="ri-poker-hearts-fill text-error"></i>
                    {health}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          {/* contents */}
          <main>
            <footer className="absolute bottom-0">
              <button className="btn btn-outline btn-neutral">Play</button>
            </footer>
          </main>
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
                  <a>
                    <i className="ri-boxing-line"></i> Robinson{' '}
                    <div className="badge badge-soft badge-success">
                      {robinsonCard.length}
                    </div>
                  </a>
                </li>
                <li>
                  <a>
                    <i className="ri-graduation-cap-line"></i> Knowledge{' '}
                    <div className="badge badge-soft badge-info">
                      {knowledgeCard.length}
                    </div>
                  </a>
                </li>
                <li>
                  <a>
                    <i className="ri-skull-line"></i>Dangerous{' '}
                    <div className="badge badge-soft badge-error">
                      {dangerCard.length}
                    </div>
                  </a>
                </li>
                <li>
                  <a>
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
                  <a>
                    <i className="ri-stack-line"></i>Deck{' '}
                    <div className="badge badge-soft badge-warning">
                      {onDeck.length}
                    </div>
                  </a>
                </li>
                <li>
                  <a>
                    <i className="ri-delete-bin-2-line"></i>Destroyed{' '}
                    <div className="badge badge-soft badge-warning">
                      {onDestroy.length}
                    </div>
                  </a>
                </li>
                <li>
                  <a>
                    <i className="ri-cross-line"></i>Graveyard{' '}
                    <div className="badge badge-soft badge-warning">
                      {onGraveyard.length}
                    </div>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
