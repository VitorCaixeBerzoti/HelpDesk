import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_URL } from '../config/api.js'

function RotaProtegida({ children }) {
  const [token] = useState(() => localStorage.getItem('token'))
  const [autenticado, setAutenticado] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    async function verificarToken() {
      if (!token) {
        return
      }

      try {
        const response = await fetch(`${API_URL}/perfil`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          setAutenticado(true)
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token')
          setAutenticado(false)
        } else {
          setErro('Não foi possível verificar sua sessão.')
        }
      } catch (erro) {
        if (erro.name !== 'AbortError')
          setErro('Não foi possível conectar ao servidor.')
      }
    }

    verificarToken()
    return () => controller.abort()
  }, [token])

  if (!token) return <Navigate to="/login" replace />
  if (erro)
    return (
      <div className="sessao-mensagem" role="alert">
        <p>{erro}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </div>
    )

  if (autenticado === null) {
    return (
      <p className="sessao-mensagem" role="status">
        Verificando sua sessão...
      </p>
    )
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RotaProtegida
