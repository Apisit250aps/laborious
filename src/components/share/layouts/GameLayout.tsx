import { useActionStore } from '@/stores/action'
import { useCardStore } from '@/stores/card'
import { useGameStore } from '@/stores/game'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function GameLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const {
    drawPoint,
    health,
    dangerScore,
    knowledgeCard,
    dangerCard,
    robinsonCard,

    setup,
    loadSave,
    save
  } = useGameStore()
  const initialized = useRef(false)
  const [loading, setLoading] = useState(true)
  const { loadCards, cards } = useCardStore()
  const { loadActions } = useActionStore()
  //
  const onInit = useCallback(async () => {
    if (initialized.current) return
    setLoading(true)
    try {
      await loadSave()
      const currentGameStart = useGameStore.getState().onGameStart
      console.log(currentGameStart)
      if (currentGameStart) {
        return
      } else {
        await Promise.all([loadActions(), loadCards()])
        await setup(cards)
      }
      initialized.current = true
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      save()
    }
  }, [cards, loadActions, loadCards, loadSave, save, setup])

  //
  useEffect(() => {
    onInit()
  }, [onInit])

  //
  return (
    <div className="drawer lg:drawer-open">
      <input id="game-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <nav className="navbar">
          <div className="flex-1">
            <label
              htmlFor="game-drawer"
              className="btn btn-ghost drawer-button lg:hidden"
            >
              <i className="ri-menu-2-line"></i>
            </label>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a>
                  <i className="ri-dice-line"></i>
                  {drawPoint}
                </a>
              </li>
              <li>
                <a>
                  <i className="ri-sword-line"></i>
                  {dangerScore}
                </a>
              </li>
              <li>
                <a>
                  <i className="ri-heart-line"></i>
                  {health}
                </a>
              </li>
            </ul>
          </div>
        </nav>
        {loading ? (
          <>
            <div className="flex justify-center">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </>
        ) : (
          <>{children}</>
        )}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="game-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <a>
              <i className="ri-book-marked-line"></i>
              Knowledge ({knowledgeCard.length})
            </a>
          </li>
          <li>
            <a>
              <i className="ri-sword-line"></i>
              Danger ({dangerCard.length})
            </a>
          </li>
          <li>
            <a>
              <i className="ri-meteor-line"></i>
              Robinson ({robinsonCard.length})
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
