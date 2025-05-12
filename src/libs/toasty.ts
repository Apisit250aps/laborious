import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

type ToastType = 'success' | 'error' | 'warning'

export function Toast(text: string, type: ToastType = 'success') {
  const backgroundMap: Record<ToastType, string> = {
    success: 'linear-gradient(to right, #00b09b, #96c93d)',
    error: 'linear-gradient(to right, #e52d27, #b31217)',
    warning: 'linear-gradient(to right, #f7971e, #ffd200)'
  }

  Toastify({
    text,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    style: {
      background: backgroundMap[type],
      color: '#fff'
    }
  }).showToast()
}
