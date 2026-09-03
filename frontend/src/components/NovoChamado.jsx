import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


function NovoChamado() {
    const navigate = useNavigate()

    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [tipoAjuda, setTipoAjuda] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()
        
        const token = localStorage.getItem('token')
        
        const response = await fetch('http://localhost:3000/chamados', {
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
        })

        const data = await response.json()

        if(!response.ok) {
            alert(data.mensagem)
            return
        }
        
        navigate('/dashboard')

    }
    return (

        
        <div>
            <h1>Novo chamado</h1>

            <form onSubmit={handleSubmit}>
            <input
                type='text'
                placeholder='Titulo do chamado'
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
            ></input>
                <textarea
                    placeholder='Descreva o problema'
                    value={descricao}
                    onChange={(event) => setDescricao(event.target.value)} 
                />
                    <select
                        value={tipoAjuda}
                        onChange={(event) => setTipoAjuda(event.target.value)}
                    >
                    <option value="">Selecione o tipo de ajuda</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Rede">Rede</option>
                    <option value="Outro">Outro</option>
                </select>

            <button type="submit">
                Criar chamado
            </button>
        </form>
    </div>
    )
}


export default NovoChamado