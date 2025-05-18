import { useGameStore } from '@/stores/game'
import Swal from 'sweetalert2'

export default function DrawButton() {
  const {
    drawCard,
    drawPoint,
    dangerSelected,
    field,
    addChat,
    setDangerScore,
    dangerScore,
    setOnDraw,
    setHealth,
    setDrawPoint
  } = useGameStore()
  const handleDrawCard = async () => {
    if (drawPoint <= 0 && dangerScore > 0) {
      await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          addChat({
            role: 'player',
            message: `บาดเจ็บ`,
            send: new Date()
          })
          setHealth(-1)
          setDrawPoint(1)
          const card = drawCard()
          if (card) {
            setDangerScore(-card.score!)
            addChat({
              role: 'player',
              message: `จั่วได้ ${card.title}`,
              send: new Date()
            })
          } else {
            alert('No cards left to draw!')
          }
        }
      })
      return
    }

    const card = drawCard()
    if (card) {
      setDangerScore(-card.score!)
      addChat({
        role: 'player',
        message: `จั่วได้ ${card.title}`,
        send: new Date()
      })
    } else {
      alert('No cards left to draw!')
    }
  }

  const whiteFlag = () => {
    const danger = dangerSelected.danger
    setHealth(-danger.danger![field])
    setOnDraw(false)
  }

  return (
    <>
      {dangerScore > 0 ? (
        <button className="btn btn-error" onClick={whiteFlag}>
          ยอมแพ้
        </button>
      ) : (
        <button className="btn btn-primary">ต่อสู้</button>
      )}
      <button className="btn btn-outline" onClick={handleDrawCard}>
        จั่วการ์ด
      </button>
    </>
  )
}
