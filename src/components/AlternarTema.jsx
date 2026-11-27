import { useEffect, useState } from 'react'
import { lerTema, salvarTema, aplicarTema } from '../utils/tema.js'

function AlternarTema() {
  const [tema, setTema] = useState(
    () => document.documentElement.dataset.tema || lerTema()
  )

  useEffect(() => {
    function sincronizar(event) {
      if (event.key === 'helpdesk-tema' || event.key === null) {
        const novoTema = lerTema()
        aplicarTema(novoTema)
        setTema(novoTema)
      }
    }
    window.addEventListener('storage', sincronizar)
    return () => window.removeEventListener('storage', sincronizar)
  }, [])

  const escuro = tema === 'escuro'
  return (
    <button
      className="alternar-tema"
      type="button"
      aria-label={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onClick={() => {
        const novoTema = escuro ? 'claro' : 'escuro'
        salvarTema(novoTema)
        setTema(novoTema)
      }}
    >
      <span aria-hidden="true">{escuro ? '☀' : '☾'}</span>
      <span>{escuro ? 'Modo claro' : 'Modo escuro'}</span>
    </button>
  )
}

export default AlternarTema
