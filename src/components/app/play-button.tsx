import { Danger, useGameStore } from '@/stores/game'
import { useState } from 'react'

const openModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement
  modal.showModal()
}

const closeModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement
  modal.close()
}

export default function PlayButton() {
  const { adventureCard, field, setDanger } = useGameStore()
  const [dangers, setDangers] = useState<Danger[]>([])
  const Play = async () => {
    const adventure = adventureCard()
    openModal('my_modal_1')
    setDangers(adventure)
  }

  const selectCard = (danger: Danger) => {
    setDanger(danger)
    closeModal('my_modal_1')
  }

  const getFieldColor = () => {
    if (field == 0) {
      return 'badge-success'
    } else if (field == 1) {
      return 'badge-warning'
    }
    return 'badge-danger'
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
          <h3 className="font-bold text-lg">Hello!</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {dangers.map((danger, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow transition-shadow duration-300"
              >
                <div className="card-body p-6">
                  {/* Header with badge */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`badge ${getFieldColor()} badge-sm`}>
                      อันตราย
                    </span>
                    <div className="text-xs text-base-content/60">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="card-title text-l font-bold mb-4 line-clamp-2">
                    {danger.danger.title}
                  </h2>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                      <i className="ri-sword-line text-error text-lg"></i>
                      <span className="text-sm font-medium">
                        {danger.danger.danger![field]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                      <i className="ri-dice-line text-warning text-lg"></i>
                      <span className="text-sm font-medium">
                        {danger.danger.pick}
                      </span>
                    </div>
                  </div>

                  <div className="divider my-4"></div>
                  <div className="h2">{danger.knowledge.title}</div>
                  {/* Knowledge section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <i className="ri-fire-fill text-orange-500"></i>
                      <span className="text-sm">
                        <span className="font-medium">คะแนน:</span>{' '}
                        {danger.knowledge.score}
                      </span>
                    </div>

                    {danger.knowledge.actionData?.title && (
                      <div className="flex items-center gap-3">
                        <i className="ri-lightbulb-flash-fill text-yellow-500"></i>
                        <span className="text-sm line-clamp-1">
                          {danger.knowledge.actionData.title}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <i className="ri-poker-diamonds-line text-purple-500"></i>
                      <span className="text-sm">
                        <span className="font-medium">Token:</span>{' '}
                        {danger.knowledge.token}
                      </span>
                    </div>
                  </div>

                  {/* Subscribe button */}
                  <div className="mt-6">
                    <button
                      onClick={() => selectCard(danger)}
                      className="btn btn-outline w-full"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
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
