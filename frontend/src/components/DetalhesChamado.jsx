import DetalhesChamado from './components/DetalhesChamado.jsx'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function DetalhesChamado() {
    const { id } =useParams()
    const [chamado, setChamado] = useState(null)

        useEffect(() => {
            async function buscarChamado() {
                const token = localStorage.getItem('token')

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

            <div className='chamados-card'
            key={chamado.id}
            onClick={() => Navigate(`/chamados/${chamado.id}`)}/>
        </div>

    )
}

export default DetalhesChamado