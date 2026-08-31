import {useState} from 'react'

function Login () {
    
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useStatus('')

    function handleLogin(event) {
        event.preventDefault()

        if(email === '' || senha === '') {
            setErro("Preencha todos os campos")
            return
        }
        setErro('')
        console.log(email) 
        console.log(senha)
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
        </form>
        </>
    )
}

export default Login