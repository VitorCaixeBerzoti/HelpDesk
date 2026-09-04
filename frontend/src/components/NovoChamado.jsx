import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
        'http://localhost:3000/chamados',
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
    <div>
      <button onClick={() => navigate('/dashboard')}>
        Voltar
      </button>

      <h1>Novo chamado</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Título do chamado"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
        />

        <textarea
          placeholder="Descreva o problema"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
        />

        <select
          value={tipoAjuda}
          onChange={(event) => setTipoAjuda(event.target.value)}
        >
          <option value="">
            Selecione o tipo de ajuda
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

        {erro && <p>{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
        >
          {enviando ? 'Criando...' : 'Criar chamado'}
        </button>

      </form>
    </div>
  )
}

export default NovoChamado