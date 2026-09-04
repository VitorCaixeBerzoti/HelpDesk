import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
        setErro(data.mensagem || 'Erro ao carregar usuários')
        return
      }

      setUsuarios(data.usuarios || [])
    } catch (erro) {
      console.error(erro)
      setErro('Não foi possível carregar os usuários')
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
        setErro(data.mensagem || 'Erro ao criar usuário')
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
      setErro('Não foi possível criar o usuário')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>

      <button onClick={() => navigate('/dashboard')}>
        Voltar
      </button>

      <h1>Usuários</h1>

      <form onSubmit={handleCriarUsuario}>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
        />

        <select
          value={cargo}
          onChange={(event) => setCargo(event.target.value)}
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

        <button
          type="submit"
          disabled={enviando}
        >
          {enviando ? 'Criando...' : 'Criar usuário'}
        </button>

      </form>

      {erro && <p>{erro}</p>}
      {sucesso && <p>{sucesso}</p>}

      <h2>Usuários cadastrados</h2>

      {carregando && (
        <p>Carregando usuários...</p>
      )}

      {!carregando && usuarios.length === 0 && (
        <p>Nenhum usuário cadastrado.</p>
      )}

      {!carregando &&
        usuarios.map((usuario) => (
          <div key={usuario.id}>
            <strong>{usuario.nome}</strong>

            <p>{usuario.email}</p>

            <p>
              Cargo: {usuario.cargo}
            </p>
          </div>
        ))}

    </div>
  )
}

export default Usuarios