import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Dashboard.css'
import { API_URL } from '../config/api.js'
import QuadroChamados from './QuadroChamados.jsx'

function Dashboard() {
  const navigate = useNavigate()

  const [chamados, setChamados] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('TODOS')
  const [filtroTipo, setFiltroTipo] = useState('TODOS')
  const [busca, setBusca] = useState('')
  const [usuario, setUsuario] = useState(null)

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function buscarChamados() {
      try {
        setCarregando(true)
        setErro('')

        const token = localStorage.getItem('token')

        const response = await fetch(`${API_URL}/chamados`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          setErro(data.mensagem || 'Erro ao carregar chamados')
          return
        }

        setChamados(data.chamados || [])
      } catch (erro) {
        console.error(erro)
        setErro('Não foi possível carregar os chamados')
      } finally {
        setCarregando(false)
      }
    }

    async function buscarPerfil() {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch(`${API_URL}/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (response.ok) {
          setUsuario(data.usuario)
        }
      } catch (erro) {
        console.error(erro)
      }
    }

    buscarChamados()
    buscarPerfil()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const chamadosFiltrados = chamados.filter((chamado) => {
    const combinaStatus =
      filtroStatus === 'TODOS' || chamado.status === filtroStatus

    const combinaTipo =
      filtroTipo === 'TODOS' || chamado.tipoAjuda === filtroTipo

    const combinaBusca = chamado.titulo
      .toLowerCase()
      .includes(busca.toLowerCase())

    return combinaStatus && combinaTipo && combinaBusca
  })

  const temFiltros = busca || filtroStatus !== 'TODOS' || filtroTipo !== 'TODOS'

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-marca">
          <span className="marca-icone" aria-hidden="true">
            H
          </span>
          <strong>HelpDesk</strong>
          <span className="marca-divisor" />
          <span className="marca-legenda">Central de suporte</span>
        </div>
        <nav className="dashboard-acoes" aria-label="Ações da conta">
          {usuario?.cargo === 'ADMIN' && (
            <button
              className="botao botao-secundario"
              onClick={() => navigate('/usuarios')}
            >
              Usuários
            </button>
          )}
          <button className="botao botao-sair" onClick={handleLogout}>
            Sair
          </button>
        </nav>
      </header>
      <section className="dashboard-area">
        <div className="dashboard-titulo">
          <div>
            <h1>Quadro de chamados</h1>
            <p>Um lugar para organizar e acompanhar seus atendimentos.</p>
          </div>
          <button
            className="botao botao-principal"
            onClick={() => navigate('/chamados/novo')}
          >
            + Novo chamado
          </button>
        </div>
        <div className="dashboard-filtros">
          <input
            aria-label="Buscar chamados pelo título"
            type="search"
            placeholder="Buscar pelo título..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
          <select
            aria-label="Filtrar por tipo"
            value={filtroTipo}
            onChange={(event) => setFiltroTipo(event.target.value)}
          >
            <option value="TODOS">Todos os tipos</option>
            {['Hardware', 'Software', 'Rede', 'Outro'].map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </select>
          <select
            aria-label="Filtrar por status"
            value={filtroStatus}
            onChange={(event) => setFiltroStatus(event.target.value)}
          >
            <option value="TODOS">Todos os status</option>
            <option value="ABERTO">Abertos</option>
            <option value="CONCLUIDO">Concluídos</option>
            <option value="FECHADO">Fechados</option>
          </select>
          {temFiltros && (
            <button
              className="botao botao-sair"
              onClick={() => {
                setBusca('')
                setFiltroStatus('TODOS')
                setFiltroTipo('TODOS')
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>
        {carregando && (
          <p className="dashboard-mensagem" role="status">
            Carregando chamados...
          </p>
        )}
        {erro && (
          <p className="dashboard-erro" role="alert">
            {erro}
          </p>
        )}
        {!carregando && !erro && (
          <>
            <p className="dashboard-contagem" role="status">
              {chamadosFiltrados.length} de {chamados.length} chamados
              {temFiltros ? ' correspondem aos filtros' : ''}
            </p>
            {chamadosFiltrados.length === 0 && (
              <p className="dashboard-vazio">
                {chamados.length
                  ? 'Nenhum chamado corresponde aos filtros.'
                  : 'Tudo tranquilo por aqui. Abra um chamado quando precisar de ajuda.'}
              </p>
            )}
            <QuadroChamados
              chamados={chamadosFiltrados}
              filtroStatus={filtroStatus}
            />
          </>
        )}
      </section>
    </main>
  )
}

export default Dashboard
