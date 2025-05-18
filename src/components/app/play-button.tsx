import { Danger, useGameStore } from '@/stores/game'
import { useState } from 'react'
import DangerousCard from './card/dangerous-card'

const openModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement
  modal.showModal()
}

const closeModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement
  modal.close()
}

export default function PlayButton() {
  const { adventureCard, setDanger, setChat } = useGameStore()
  const [dangers, setDangers] = useState<Danger[]>([])
  const Play = async () => {
    setChat({
      role: 'system',
      message: 'อันตราย',
      send: new Date()
    })
    const adventure = adventureCard()

    openModal('my_modal_1')
    setDangers(adventure)
  }

  const selectCard = (danger: Danger) => {
    setChat({
      role: 'player',
      message: `เผชิญ ${danger.danger.title}`,
      send: new Date()
    })
    setDanger(danger)
    setChat({
      role: 'system',
      message: `จั๋วการ์ด ${danger.danger.pick} ใบ`,
      send: new Date()
    })
    closeModal('my_modal_1')
  }

  return (
    <>
      <button
        onClick={Play}
        className="btn btn-outline btn-error absolute bottom-4 right-4"
      >
        PLay
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">อันตราย</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {dangers.map((danger, index) => (
              <DangerousCard
                danger={danger}
                index={index}
                key={index}
                onSelect={selectCard}
              />
            ))}
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
