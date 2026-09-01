import {useState} from 'react'
import './Login.css'


function Login () {
    
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] =useState('')

    function handleLogin(event) {
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

        const usuarioTeste = {
            email: 'admin@helpdesk.com',
            senha: '123456'
            }
        if ( email !== usuarioTeste.email|| senha !== usuarioTeste.senha) {
            setErro("Email ou senha incorretos")
            setSucesso('')
            return
        }
        setErro('')
        setSucesso('Login realizado com sucesso')

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
