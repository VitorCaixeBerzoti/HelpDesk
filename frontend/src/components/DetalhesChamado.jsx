import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function DetalhesChamado() {
  const { id } = useParams()

  const [chamado, setChamado] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const [status, setStatus] = useState('')
  const [descricaoSolucao, setDescricaoSolucao] = useState('')

  useEffect(() => {
    async function buscarChamado() {
      const token = localStorage.getItem('token')

      const responsePerfil = await fetch('http://localhost:3000/perfil', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

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
        return
      }

      setChamado(data.chamado)
      setStatus(data.chamado.status)
      setDescricaoSolucao(data.chamado.descricaoSolucao || '')
    }

    buscarChamado()
  }, [id])

  async function handleAtualizar() {
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
      alert(data.mensagem)
      return
    }

    setChamado(data.chamado)
  }

  async function handleAssumir() {
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
      alert(data.mensagem)
      return
    }

    setChamado(data.chamado)
  }

  if (!chamado) {
    return <p>Carregando chamado...</p>
  }

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
        Criado em: {new Date(chamado.dataDeCriacao).toLocaleString('pt-BR')}
      </p>

      {chamado.descricaoSolucao && (
        <p>
          Solução: {chamado.descricaoSolucao}
        </p>
      )}

      {usuario &&
        (usuario.cargo === 'ADMIN' || usuario.cargo === 'TECNICO') && (
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
              onChange={(event) => setDescricaoSolucao(event.target.value)}
            />

            <button onClick={handleAtualizar}>
              Salvar alterações
            </button>
          </div>
        )}

      {usuario &&
        (usuario.cargo === 'ADMIN' || usuario.cargo === 'TECNICO') &&
        !chamado.tecnicoId && (
          <button onClick={handleAssumir}>
            Assumir chamado
          </button>
        )}

    </div>
  )
}

export default DetalhesChamado