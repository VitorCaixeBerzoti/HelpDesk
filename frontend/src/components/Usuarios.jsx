import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Usuario() {
    const navigate = useNavigate()

    const [usuario, setUsuarios] = useState([])
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [cargo, setCargo] = useState('USUARIO')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')

    async function buscarUsuario() {
        const token = localStorage.getItem('token')

        const response = await fetch('http://localhost:3000/usuarios', {
            headers: {
                Autorization: `Bearer ${token}`
            }
        })

        const data = await response.json()

            if (!response.ok) {
                setErro(data.mensagem)
                return
        }

        setUsuarios(data.usuarios)
        }

        useEffect(() => {
            buscarUsuarios()
        }, [])

        async function handleCriarUsuario(event) {
            event.preventDefault()

            const token = localStorage.getItem('token')

            const response = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Autorization: `Bearer ${token}`
                },
                body:JSON.stringify({
                    nome,
                    email,
                    senha,
                    cargo
                })
            })

            const data = await response.json()

            if(!response.ok) {
                setErro(data.mensagem)
                setSucesso('')
                return
            }

            setErro('')
            setSucesso('Usuario criado com sucesso')

            setNome('')
            setEmail('')
            setSenha('')
            setCargo('USUARIO')

            buscarUsuario()
        }

        return (
            <div>
                <button onClick={() => navigate('/dashboard')}>
                    Voltar
                </button>

                <h1>Usuarios</h1>

                <form onSubmit={handleCriarUsuario}>
                    <input 
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                    />

                    <input 
                        type='email'
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <input 
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                    />

                    <select
                        value={cargo}
                        onChange={(event) => setCargo(event.target.value)}
                    >
                       <option value="USUARIO">Usuário</option> 
                       <option value="TECNICO">Técnico</option> 
                       <option value="ADMIN">Adiministrador</option> 
                    </select>

                    <button type="submit">
                        Criar usuário
                    </button>
                </form>

                {erro & <p>{erro}</p>}
                {sucesso && <p>{sucesso}</p>}

                <h2>Usuários cadastrados</h2>

                {usuario.map((usuario) => (
                    <div key={usuario.id}>
                        <strong>{usuario.nome}</strong>
                        <p>{usuario.email}</p>
                        <p>Cargo: {usuario.cargo}</p>
                    </div>
                ))}
            </div>
        )
}

export default Usuarios