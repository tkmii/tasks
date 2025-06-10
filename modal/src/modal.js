export class Modal {

  constructor() {
    this.modal = document.querySelector('[data-modal]')
    this.open = document.querySelector('[data-modal-open]')
    this.close = document.querySelector('[data-modal-close]')

    this.open.addEventListener('click', () => {
      this.modal.classList.add('active')
    })
    this.close.addEventListener('click', () => {
      this.closePopup()
    })
    document.addEventListener('click', (e) => {

      if (e.composedPath()[0] == this.modal) {
        this.closePopup()
      }
    })
  }

  closePopup() {
    this.modal.classList.remove('active')
  }
}