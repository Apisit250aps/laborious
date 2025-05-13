import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

import Swal from 'sweetalert2'

type ToastType = 'success' | 'error' | 'warning'

export async function Toast(text: string, type: ToastType = 'success') {
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

export function confirmDelete(
  onConfirm: () => Promise<boolean>,
  options?: {
    title?: string
    text?: string
    confirmButtonText?: string
    cancelButtonText?: string
  }
) {
  Swal.fire({
    title: options?.title || 'Are you sure?',
    text: options?.text || 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: options?.confirmButtonText || 'Yes, delete it!',
    cancelButtonText: options?.cancelButtonText || 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await onConfirm()
      if (res) {
        Swal.fire({
          title: 'Deleted!',
          text: 'The item has been deleted.',
          icon: 'success'
        })
        return
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'The item has been delete error.',
          icon: 'error'
        })
      }
    }
  })
}
