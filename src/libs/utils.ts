export const openModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement
  modal.showModal()
}