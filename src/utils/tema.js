export function lerTema() {
  try {
    const salvo = localStorage.getItem('helpdesk-tema')
    if (salvo === 'claro' || salvo === 'escuro') return salvo
  } catch {
    /* A preferência continua funcionando sem armazenamento. */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'escuro'
    : 'claro'
}

export function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema
}

export function salvarTema(tema) {
  aplicarTema(tema)
  try {
    localStorage.setItem('helpdesk-tema', tema)
  } catch {
    /* O tema permanece aplicado nesta sessão. */
  }
}
