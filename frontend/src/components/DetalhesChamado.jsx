import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './DetalhesChamado.css'

function DetalhesChamado() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [chamado, setChamado] = useState(null)
  const [usuario, setUsuario] = useState(null)

  const [status, setStatus] = useState('')
  const [descricaoSolucao, setDescricaoSolucao] = useState('')

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [erroAcao, setErroAcao] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function buscarChamado() {
    try {
      setCarregando(true)
      setErro('')

      const token = localStorage.getItem('token')

      const responsePerfil = await fetch(
        'http://localhost:3000/perfil',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const dataPerfil = await responsePerfil.json()

      if (responsePerfil.ok) {
        setUsuario(dataPerfil.usuario)
      }

      const response = await fetch(
        `http://localhost:3000/chamados/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErro(data.mensagem || 'Erro ao carregar chamado')
        return
      }

      setChamado(data.chamado)
      setStatus(data.chamado.status)
      setDescricaoSolucao(
        data.chamado.descricaoSolucao || ''
      )
    } catch (erro) {
      console.error(erro)
      setErro('Não foi possível carregar o chamado')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarChamado()
  }, [id])

  async function handleAtualizar() {
    try {
      setErroAcao('')
      setSucesso('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:3000/chamados/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status,
            descricaoSolucao
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErroAcao(
          data.mensagem || 'Erro ao atualizar chamado'
        )
        return
      }

      setSucesso('Chamado atualizado com sucesso')

      await buscarChamado()
    } catch (erro) {
      console.error(erro)
      setErroAcao(
        'Não foi possível atualizar o chamado'
      )
    }
  }

  async function handleAssumir() {
    try {
      setErroAcao('')
      setSucesso('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:3000/chamados/${id}/assumir`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErroAcao(
          data.mensagem || 'Erro ao assumir chamado'
        )
        return
      }

      setSucesso('Chamado assumido com sucesso')

      await buscarChamado()
    } catch (erro) {
      console.error(erro)
      setErroAcao(
        'Não foi possível assumir o chamado'
      )
    }
  }

  if (carregando) {
    return (
      <div className="detalhes">
        <div className="detalhes-container">
          <p>Carregando chamado...</p>
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="detalhes">
        <div className="detalhes-container">
          <p className="detalhes-erro">{erro}</p>
        </div>
      </div>
    )
  }

  if (!chamado) {
    return (
      <div className="detalhes">
        <div className="detalhes-container">
          <p>Chamado não encontrado.</p>
        </div>
      </div>
    )
  }

  const podeGerenciar =
    usuario &&
    (usuario.cargo === 'ADMIN' ||
      usuario.cargo === 'TECNICO')

  return (
    <div className="detalhes">
      <div className="detalhes-container">

        <button
          className="detalhes-voltar"
          onClick={() => navigate('/dashboard')}
        >
          ← Voltar para o Dashboard
        </button>

        <div className="detalhes-card">

          <div className="detalhes-topo">
            <div>
              <h1>Detalhes do chamado</h1>

              <p className="detalhes-id">
                Chamado #{id}
              </p>
            </div>

            <span className="detalhes-status">
              {chamado.status}
            </span>
          </div>

          <h2 className="detalhes-titulo">
            {chamado.titulo}
          </h2>

          <p className="detalhes-descricao">
            {chamado.descricao}
          </p>

          <div className="detalhes-info">

            <div className="detalhes-info-item">
              <span>Tipo</span>
              <strong>{chamado.tipoAjuda}</strong>
            </div>

            <div className="detalhes-info-item">
              <span>Solicitante</span>
              <strong>
                {chamado.usuario?.nome ||
                  'Não informado'}
              </strong>
            </div>

            <div className="detalhes-info-item">
              <span>Técnico responsável</span>
              <strong>
                {chamado.tecnico?.nome ||
                  'Não atribuído'}
              </strong>
            </div>

            <div className="detalhes-info-item">
              <span>Criado em</span>
              <strong>
                {new Date(
                  chamado.dataDeCriacao
                ).toLocaleString('pt-BR')}
              </strong>
            </div>

          </div>

          {chamado.descricaoSolucao && (
            <div className="detalhes-solucao">
              <strong>Solução</strong>

              <p>{chamado.descricaoSolucao}</p>
            </div>
          )}

        </div>

        {podeGerenciar && (
          <div className="detalhes-acoes">

            <h2>Gerenciar chamado</h2>

            {erroAcao && (
              <p className="detalhes-erro">
                {erroAcao}
              </p>
            )}

            {sucesso && (
              <p className="detalhes-sucesso">
                {sucesso}
              </p>
            )}

            <div className="detalhes-form">

              <label>Status</label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <option value="ABERTO">
                  ABERTO
                </option>

                <option value="FECHADO">
                  FECHADO
                </option>

                <option value="CONCLUIDO">
                  CONCLUIDO
                </option>
              </select>

              <label>Descrição da solução</label>

              <textarea
                placeholder="Descreva como o problema foi resolvido..."
                value={descricaoSolucao}
                onChange={(event) =>
                  setDescricaoSolucao(
                    event.target.value
                  )
                }
              />

              <div className="detalhes-botoes">

                <button
                  className="detalhes-botao"
                  onClick={handleAtualizar}
                >
                  Salvar alterações
                </button>

                {!chamado.tecnicoId && (
                  <button
                    className="detalhes-botao detalhes-botao-secundario"
                    onClick={handleAssumir}
                  >
                    Assumir chamado
                  </button>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default DetalhesChamado