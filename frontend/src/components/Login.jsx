import { API_URL } from '../config/api.js'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [entrando, setEntrando] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()

    setErro('')

    if (!email || !senha) {
      setErro('Preencha o email e a senha')
      return
    }

    if (!email.includes('@')) {
      setErro('Informe um email válido')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve possuir pelo menos 6 caracteres')
      return
    }

    try {
      setEntrando(true)

      const response = await fetch(
        `${API_URL}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email,
            senha
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErro(
          data.mensagem ||
          'Não foi possível realizar o login'
        )
        return
      }

      localStorage.setItem('token', data.token)

      navigate('/dashboard')
    } catch (erro) {
      console.error(erro)

      setErro(
        'Não foi possível conectar ao servidor'
      )
    } finally {
      setEntrando(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">

          <h1>HelpDesk</h1>

          <p>
            Entre para acessar o sistema
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="login-grupo">

            <label>Email</label>

            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

          </div>

          <div className="login-grupo">

            <label>Senha</label>

            <div className="login-senha-container">

              <input
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(event) =>
                  setSenha(event.target.value)
                }
              />

              <button
                type="button"
                className="login-mostrar-senha"
                onClick={() =>
                  setMostrarSenha(!mostrarSenha)
                }
              >
                {mostrarSenha ? 'Ocultar' : 'Mostrar'}
              </button>

            </div>

          </div>

          {erro && (
            <p className="login-erro">
              {erro}
            </p>
          )}

          <button
            className="login-botao"
            type="submit"
            disabled={entrando}
          >
            {entrando
              ? 'Entrando...'
              : 'Entrar'}
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login