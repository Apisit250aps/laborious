import { useGameStore } from '@/stores/game'
import Swal from 'sweetalert2'

export default function DrawButton() {
  const {
    drawPoint,
    dangerSelected,
    field,
    dangerScore,
    drawCard,
    setChat,
    setDangerScore,
    setHealth,
    setDrawPoint,
    setEndRound,
    setFight,
    setWhiteFlag,
    save
  } = useGameStore()
  const handleDrawCard = async () => {
    if (drawPoint <= 0 && dangerScore > 0) {
      await Swal.fire({
        title: 'คุณแน่ใจไหม?',
        text: 'คุณจะยอมเสียเลือด 1 แต้ม เพื่อจั่วการ์ด',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยินดี'
      }).then((result) => {
        if (result.isConfirmed) {
          setChat({
            role: 'player',
            message: `บาดเจ็บ`,
            send: new Date()
          })
          setHealth(-1)
          setDrawPoint(1)
          const card = drawCard()
          if (card) {
            setDangerScore(-card.score!)
            setChat({
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
      setChat({
        role: 'player',
        message: `จั่วได้ ${card.title}`,
        send: new Date()
      })
    } else {
      alert('No cards left to draw!')
    }

    save()
  }

  const fight = () => {
    const danger = dangerSelected
    setFight(danger)
    
    setEndRound()
    save()
  }

  const whiteFlag = async () => {
    const danger = dangerSelected.danger
    await Swal.fire({
      title: 'คุณแน่ใจใช่ไหม',
      text: `คุณจะยอมเสียเลือด ${danger.danger![field]} หน่วยเพื่อยอมแพ้`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ขอยอมแพ้',
      cancelButtonText: 'สู้ต่อไป'
    }).then((result) => {
      if (result.isConfirmed) {
        setWhiteFlag(dangerSelected)
        setHealth(-danger.danger![field])
        setEndRound()
        save()
      }
    })
  }

  return (
    <>
      {dangerScore > 0 ? (
        <button className="btn btn-error" onClick={whiteFlag}>
          ยอมแพ้
        </button>
      ) : drawPoint <= 0 ? (
        <button className="btn btn-primary" onClick={fight}>
          ต่อสู้
        </button>
      ) : null}
      <button className="btn btn-outline" onClick={handleDrawCard}>
        จั่วการ์ด
      </button>
    </>
  )
}
