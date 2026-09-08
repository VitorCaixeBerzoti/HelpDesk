import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Dashboard.css'
import { API_URL } from '../config/api.js'

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

        const response = await fetch(
          `${API_URL}/chamados`,
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
            'Erro ao carregar chamados'
          )
          return
        }

        setChamados(data.chamados || [])
      } catch (erro) {
        console.error(erro)
        setErro(
          'Não foi possível carregar os chamados'
        )
      } finally {
        setCarregando(false)
      }
    }

    async function buscarPerfil() {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch(
          `${API_URL}/perfil`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

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

  function classeStatus(status) {
    if (status === 'ABERTO') {
      return 'status status-aberto'
    }

    if (status === 'FECHADO') {
      return 'status status-fechado'
    }

    if (status === 'CONCLUIDO') {
      return 'status status-concluido'
    }

    return 'status'
  }

  function traduzirStatus(status) {
    if (status === 'ABERTO') {
      return 'Aberto'
    }

    if (status === 'FECHADO') {
      return 'Fechado'
    }

    if (status === 'CONCLUIDO') {
      return 'Concluído'
    }

    return status
  }

  const chamadosFiltrados = chamados.filter(
    (chamado) => {
      const combinaStatus =
        filtroStatus === 'TODOS' ||
        chamado.status === filtroStatus

      const combinaTipo =
        filtroTipo === 'TODOS' ||
        chamado.tipoAjuda === filtroTipo

      const combinaBusca =
        chamado.titulo
          .toLowerCase()
          .includes(busca.toLowerCase())

      return (
        combinaStatus &&
        combinaTipo &&
        combinaBusca
      )
    }
  )

  const totalChamados = chamados.length

  const totalAbertos = chamados.filter(
    (chamado) => chamado.status === 'ABERTO'
  ).length

  const totalFechados = chamados.filter(
    (chamado) => chamado.status === 'FECHADO'
  ).length

  const totalConcluidos = chamados.filter(
    (chamado) =>
      chamado.status === 'CONCLUIDO'
  ).length

  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div>
          <h1>HelpDesk</h1>

          <p>
            Gerencie e acompanhe suas solicitações
          </p>
        </div>

        <div className="dashboard-acoes">

          <button
            className="botao botao-principal"
            onClick={() =>
              navigate('/chamados/novo')
            }
          >
            + Novo chamado
          </button>

          {usuario?.cargo === 'ADMIN' && (
            <button
              className="botao botao-secundario"
              onClick={() =>
                navigate('/usuarios')
              }
            >
              Gerenciar usuários
            </button>
          )}

          <button
            className="botao botao-sair"
            onClick={handleLogout}
          >
            Sair
          </button>

        </div>

      </div>

      <div className="dashboard-resumo">

        <div className="resumo-card">
          <span>Total</span>
          <strong>{totalChamados}</strong>
        </div>

        <div className="resumo-card">
          <span>Abertos</span>
          <strong>{totalAbertos}</strong>
        </div>

        <div className="resumo-card">
          <span>Fechados</span>
          <strong>{totalFechados}</strong>
        </div>

        <div className="resumo-card">
          <span>Concluídos</span>
          <strong>{totalConcluidos}</strong>
        </div>

      </div>

      <div className="dashboard-conteudo">

        <div className="dashboard-titulo-lista">
          <div>
            <h2>Chamados</h2>

            <p>
              Acompanhe as solicitações registradas
            </p>
          </div>
        </div>

        <div className="dashboard-filtros">

          <input
            type="text"
            placeholder="Buscar pelo título..."
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
          />

          <select
            value={filtroStatus}
            onChange={(event) =>
              setFiltroStatus(
                event.target.value
              )
            }
          >
            <option value="TODOS">
              Todos os status
            </option>

            <option value="ABERTO">
              Abertos
            </option>

            <option value="FECHADO">
              Fechados
            </option>

            <option value="CONCLUIDO">
              Concluídos
            </option>
          </select>

          <select
            value={filtroTipo}
            onChange={(event) =>
              setFiltroTipo(
                event.target.value
              )
            }
          >
            <option value="TODOS">
              Todos os tipos
            </option>

            <option value="Hardware">
              Hardware
            </option>

            <option value="Software">
              Software
            </option>

            <option value="Rede">
              Rede
            </option>

            <option value="Outro">
              Outro
            </option>
          </select>

        </div>

        {carregando && (
          <p className="dashboard-mensagem">
            Carregando chamados...
          </p>
        )}

        {erro && (
          <p className="dashboard-erro">
            {erro}
          </p>
        )}

        {!carregando &&
          !erro &&
          chamados.length === 0 && (
            <p className="dashboard-mensagem">
              Nenhum chamado encontrado.
            </p>
          )}

        {!carregando &&
          !erro &&
          chamados.length > 0 &&
          chamadosFiltrados.length === 0 && (
            <p className="dashboard-mensagem">
              Nenhum chamado corresponde aos filtros.
            </p>
          )}

        <div className="chamados-lista">

          {!carregando &&
            !erro &&
            chamadosFiltrados.map(
              (chamado) => (
                <div
                  className="chamado-card"
                  key={chamado.id}
                  onClick={() =>
                    navigate(
                      `/chamados/${chamado.id}`
                    )
                  }
                >

                  <div className="chamado-topo">

                    <div>
                      <span className="chamado-id">
                        Chamado #{chamado.id}
                      </span>

                      <h3>
                        {chamado.titulo}
                      </h3>
                    </div>

                    <span
                      className={classeStatus(
                        chamado.status
                      )}
                    >
                      {traduzirStatus(
                        chamado.status
                      )}
                    </span>

                  </div>

                  <p className="chamado-descricao">
                    {chamado.descricao}
                  </p>

                  <div className="chamado-informacoes">

                    <div>
                      <span>Solicitante</span>
                      <strong>
                        {chamado.usuario?.nome ||
                          'Não informado'}
                      </strong>
                    </div>

                    <div>
                      <span>Técnico</span>
                      <strong>
                        {chamado.tecnico?.nome ||
                          'Não atribuído'}
                      </strong>
                    </div>

                    <div>
                      <span>Tipo</span>
                      <strong>
                        {chamado.tipoAjuda}
                      </strong>
                    </div>

                    <div>
                      <span>Criado em</span>
                      <strong>
                        {new Date(
                          chamado.dataDeCriacao
                        ).toLocaleString(
                          'pt-BR'
                        )}
                      </strong>
                    </div>

                  </div>

                </div>
              )
            )}

        </div>

      </div>

    </div>
  )
}

export default Dashboard