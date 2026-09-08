import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Usuarios.css'

function Usuarios() {
  const navigate = useNavigate()

  const [usuarios, setUsuarios] = useState([])

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cargo, setCargo] = useState('USUARIO')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)

  async function buscarUsuarios() {
    try {
      setCarregando(true)
      setErro('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:3000/usuarios',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErro(
          data.mensagem ||
          'Erro ao carregar usuários'
        )
        return
      }

      setUsuarios(data.usuarios || [])
    } catch (erro) {
      console.error(erro)
      setErro(
        'Não foi possível carregar os usuários'
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarUsuarios()
  }, [])

  async function handleCriarUsuario(event) {
    event.preventDefault()

    try {
      setEnviando(true)
      setErro('')
      setSucesso('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:3000/usuarios',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            nome,
            email,
            senha,
            cargo
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErro(
          data.mensagem ||
          'Erro ao criar usuário'
        )
        return
      }

      setSucesso('Usuário criado com sucesso')

      setNome('')
      setEmail('')
      setSenha('')
      setCargo('USUARIO')

      await buscarUsuarios()
    } catch (erro) {
      console.error(erro)
      setErro(
        'Não foi possível criar o usuário'
      )
    } finally {
      setEnviando(false)
    }
  }

  function traduzirCargo(cargo) {
    if (cargo === 'ADMIN') {
      return 'Administrador'
    }

    if (cargo === 'TECNICO') {
      return 'Técnico'
    }

    return 'Usuário'
  }

  return (
    <div className="usuarios">
      <div className="usuarios-container">

        <button
          className="usuarios-voltar"
          onClick={() => navigate('/dashboard')}
        >
          ← Voltar para o Dashboard
        </button>

        <div className="usuarios-header">
          <h1>Gerenciamento de usuários</h1>

          <p>
            Cadastre e visualize os usuários do sistema.
          </p>
        </div>

        <div className="usuarios-card">

          <h2>Novo usuário</h2>

          <form
            className="usuarios-form"
            onSubmit={handleCriarUsuario}
          >

            <div className="usuarios-form-grupo">
              <label>Nome</label>

              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(event) =>
                  setNome(event.target.value)
                }
              />
            </div>

            <div className="usuarios-form-grupo">
              <label>Email</label>

              <input
                type="email"
                placeholder="usuario@email.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>

            <div className="usuarios-form-grupo">
              <label>Senha</label>

              <input
                type="password"
                placeholder="Senha do usuário"
                value={senha}
                onChange={(event) =>
                  setSenha(event.target.value)
                }
              />
            </div>

            <div className="usuarios-form-grupo">
              <label>Cargo</label>

              <select
                value={cargo}
                onChange={(event) =>
                  setCargo(event.target.value)
                }
              >
                <option value="USUARIO">
                  Usuário
                </option>

                <option value="TECNICO">
                  Técnico
                </option>

                <option value="ADMIN">
                  Administrador
                </option>
              </select>
            </div>

            <button
              className="usuarios-form-botao"
              type="submit"
              disabled={enviando}
            >
              {enviando
                ? 'Criando usuário...'
                : 'Criar usuário'}
            </button>

          </form>

          {erro && (
            <p className="usuarios-erro">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="usuarios-sucesso">
              {sucesso}
            </p>
          )}

        </div>

        <h2>Usuários cadastrados</h2>

        {carregando && (
          <p>Carregando usuários...</p>
        )}

        {!carregando && usuarios.length === 0 && (
          <p>Nenhum usuário cadastrado.</p>
        )}

        <div className="usuarios-lista">

          {!carregando &&
            usuarios.map((usuario) => (
              <div
                className="usuario-item"
                key={usuario.id}
              >

                <div className="usuario-item-topo">

                  <h3>{usuario.nome}</h3>

                  <span className="usuario-cargo">
                    {traduzirCargo(usuario.cargo)}
                  </span>

                </div>

                <p>{usuario.email}</p>

              </div>
            ))}

        </div>

      </div>
    </div>
  )
}

export default Usuarios