import DetalhesChamado from './components/DetalhesChamado.jsx'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function DetalhesChamado() {
    const { id } =useParams()
    const [chamado, setChamado] = useState(null)
    const [usuario, setUsuario] = useState(null)
    const [descricaoSolucao, SetDescricaoSolucao] = useState('')

        useEffect(() => {
            async function handleAtualizar() {
                const token = localStorage.getItem('token')

                const response = await fetch(`http://localhost:3000/chamados/${id}`, {
                    methond: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status,
                        descricaoSolucao
                    })
                })

                const data = await response.json()

                if(!response.ok) {
                    alert(data.mensagem)
                    return
                }

                setChamado(data.chamado)
            }
            async function buscarChamado() {
                const token = localStorage.getItem('token')

                const responsePerfil = await fetch('http://localhost:300/perfil', {
                    headers: {
                        Autorization: `Bearer ${token}`
                    }
                })

                const dataPerfil =await responsePerfil.json()

                if (responsePerfil.ok) {
                    setUsuario(dataPerfil.usuario)
                }
                

                const response = await fetch(`http://localhost:3000/chamados/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

            const data = await response.json()

        if(!response.ok) {
            return
        }

        setChamado(data.chamado)
        setStatus(data.chamado.satus)
        SetDescricaoSolucao(data.chamado.descricaoSolucao || '')
    }

    buscarChamado()
}, [id])

if (!chamado) {
    return <p>Carregando chamado...</p>
}

    return (
        <div>
            <h1>Descricao do chamado</h1>

            <p>ID do chamado: {id}</p>

            <h1>{chamado.titulo}</h1>

            <p>{chamado.descricao}</p>
            <p>Tipo: {chamado.tipoAjuda}</p>
            <p>Status: {chamado.status}</p>
            <p> 
                Criando em: {new Date(chamado.dataDeCriacao).toLocaleString('pt-BR')}
            </p>

            {chamado.descricaoSolucao && (
                <p>Solução: {chamado.descricaoSolucao}</p>
            )}

            {usuario && (usuario.cargo === 'ADMIN' || usuario.cargo === 'TECNICO') && (
                <div>
                    <h2>Atualizar chamdo</h2>

                    <select 
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value='ABERTO'>ABERTO</option>
                        <option value='FECHADO'>FECHADO</option>
                        <option value='CONCLUIDO'>CONCLUIDO</option>
                    </select>

                    <textarea 
                    placeholder='Descrição da solução'
                    value={descricaoSolucao}
                    onChange={(event) => SetDescricaoSolucao(event.target.value)}
                    />

                    <button onClick={handleAtualizar}>
                        Salvar alterações
                    </button>
                </div>
            )}

            <div className='chamados-card'
            key={chamado.id}
            onClick={() => Navigate(`/chamados/${chamado.id}`)}/>
        </div>

    )
}

export default DetalhesChamado