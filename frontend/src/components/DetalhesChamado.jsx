import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function DetalhesChamado() {
  const { id } = useParams()

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
        setErroAcao(data.mensagem || 'Erro ao atualizar chamado')
        return
      }

      setSucesso('Chamado atualizado com sucesso')

      await buscarChamado()
    } catch (erro) {
      console.error(erro)
      setErroAcao('Não foi possível atualizar o chamado')
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
        setErroAcao(data.mensagem || 'Erro ao assumir chamado')
        return
      }

      setSucesso('Chamado assumido com sucesso')

      await buscarChamado()
    } catch (erro) {
      console.error(erro)
      setErroAcao('Não foi possível assumir o chamado')
    }
  }

  if (carregando) {
    return <p>Carregando chamado...</p>
  }

  if (erro) {
    return <p>{erro}</p>
  }

  if (!chamado) {
    return <p>Chamado não encontrado.</p>
  }

  const podeGerenciar =
    usuario &&
    (usuario.cargo === 'ADMIN' || usuario.cargo === 'TECNICO')

  return (
    <div>
      <h1>Detalhes do chamado</h1>

      <p>ID do chamado: {id}</p>

      <h2>{chamado.titulo}</h2>

      <p>{chamado.descricao}</p>

      <p>
        Tipo: {chamado.tipoAjuda}
      </p>

      <p>
        Status: {chamado.status}
      </p>

      <p>
        Criado em:{' '}
        {new Date(chamado.dataDeCriacao).toLocaleString('pt-BR')}
      </p>

      <p>
        Solicitante: {chamado.usuario?.nome || 'Não informado'}
      </p>

      <p>
        Técnico responsável:{' '}
        {chamado.tecnico?.nome || 'Não atribuído'}
      </p>

      {chamado.descricaoSolucao && (
        <p>
          Solução: {chamado.descricaoSolucao}
        </p>
      )}

      {erroAcao && <p>{erroAcao}</p>}
      {sucesso && <p>{sucesso}</p>}

      {podeGerenciar && (
        <div>
          <h2>Atualizar chamado</h2>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="ABERTO">ABERTO</option>
            <option value="FECHADO">FECHADO</option>
            <option value="CONCLUIDO">CONCLUIDO</option>
          </select>

          <textarea
            placeholder="Descrição da solução"
            value={descricaoSolucao}
            onChange={(event) =>
              setDescricaoSolucao(event.target.value)
            }
          />

          <button onClick={handleAtualizar}>
            Salvar alterações
          </button>
        </div>
      )}

      {podeGerenciar && !chamado.tecnicoId && (
        <button onClick={handleAssumir}>
          Assumir chamado
        </button>
      )}

    </div>
  )
}

export default DetalhesChamado