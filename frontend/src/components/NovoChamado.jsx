import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NovoChamado.css'
import { API_URL } from '../config/api.js'

function NovoChamado() {
  const navigate = useNavigate()

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [tipoAjuda, setTipoAjuda] = useState('')

  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setEnviando(true)
      setErro('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/chamados`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            titulo,
            descricao,
            tipoAjuda
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErro(data.mensagem || 'Erro ao criar chamado')
        return
      }

      navigate('/dashboard')
    } catch (erro) {
      console.error(erro)
      setErro('Não foi possível criar o chamado')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="novo-chamado">
      <div className="novo-chamado-container">

        <button
          className="novo-chamado-voltar"
          onClick={() => navigate('/dashboard')}
        >
          ← Voltar para o Dashboard
        </button>

        <div className="novo-chamado-card">

          <h1>Novo chamado</h1>

          <p className="novo-chamado-subtitulo">
            Descreva o problema para abrir uma nova solicitação.
          </p>

          <form
            className="novo-chamado-form"
            onSubmit={handleSubmit}
          >

            <div className="form-grupo">
              <label>Título</label>

              <input
                type="text"
                placeholder="Ex: Computador não liga"
                value={titulo}
                onChange={(event) =>
                  setTitulo(event.target.value)
                }
              />
            </div>

            <div className="form-grupo">
              <label>Descrição</label>

              <textarea
                placeholder="Descreva o problema com mais detalhes..."
                value={descricao}
                onChange={(event) =>
                  setDescricao(event.target.value)
                }
              />
            </div>

            <div className="form-grupo">
              <label>Tipo de ajuda</label>

              <select
                value={tipoAjuda}
                onChange={(event) =>
                  setTipoAjuda(event.target.value)
                }
              >
                <option value="">
                  Selecione uma opção
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

            {erro && (
              <p className="novo-chamado-erro">
                {erro}
              </p>
            )}

            <button
              className="novo-chamado-submit"
              type="submit"
              disabled={enviando}
            >
              {enviando
                ? 'Criando chamado...'
                : 'Criar chamado'}
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default NovoChamado