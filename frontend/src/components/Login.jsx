import {useState} from 'react'

function Login () {
    
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useStatus('')
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
        <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" 
            value={email}
            onChange={(event) => setEmail(event.target.value)}/>
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="passaword" 
            value={senha}
            onChange={(event) => setSenha(event.target.value)}/>
            <button type="submit">Entrar</button>
            <p>{erro}</p>
            <p>{sucesso}</p>
        </form>
        </>
    )
}

export default Login