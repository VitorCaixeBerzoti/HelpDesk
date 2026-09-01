import {useState} from 'react'
import './Login.css'


function Login () {
    
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] =useState('')

    async function handleLogin(event) {
        event.preventDefault()

        if(email === '' || senha === '') {
            setErro("Preencha todos os campos")
            setSucesso('')
            return
        }
        if (!email.includes('@')) {
            setErro("Digite um email válido")
            setSucesso('')
            return
        }
        if (senha.length < 6) {
            setErro("Precisa ter 6 ou mais caracteries")
            setSucesso('')
            return
        }
        try{
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            })
            const data = await response.json()
            if(!response.ok) {
                setErro(data.mensagem)
                setSucesso('')
                return
            }

        setErro('')
        setSucesso(data.mensagem)
    } catch (erro) {
        setErro('Não foi possivel conectar ao servidor')
        setSucesso('')
    }
}



    return (
    <>
        <div className="login-container">

            <form className="login-form" onSubmit={handleLogin}>

                <h1 className='login-title'>HelpDesk</h1>
                <p className='login-subtitle'>Sistema de chamados de TI</p>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="senha">Senha</label>
                    <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    />
                </div>

                <button type="submit">Entrar</button>

                {erro && <p className='login-error'>{erro}</p>}
                {sucesso && <p className='login-success'>{sucesso}</p>}
            </form>
        </div>
    </>
    )
}

export default Login
