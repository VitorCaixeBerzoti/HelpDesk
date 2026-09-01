import express from 'express'
import cors from 'cors'
import { prisma } from './lib/prisma.js'
import bcrypt from 'bcrypt'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('backend do HelpDesk funcionando!')
})

app.post('/login', async (req, res) => {
    const { email, senha } = req.body

    const usuario = await prisma.usuario.findUnique({
        where: {
            email
        }
    })

    
    if(!usuario) {
        return res.status(401).json({
            mensagem: 'Email ou senha incorretos'
        })
    }
    
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    
    if(!senhaCorreta){
        return res.status(401).json({
            mensagem: 'Email ou senha incorretos'
        })
        
    }
    return res.status(200).json({
        mensagem: 'Login realizado com sucesso'
    })
})

app.post('/usuarios', async (req, res) => {
    const { nome, email, senha, cargo } = req.body
    
        if(!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: 'Preencha todos os campos'
            })
        }
    
    const usuarioExistente = await prisma.usuario.findUnique({
        where: {
            email
        }
    })

    if(usuarioExistente) {
        return res.status(409).json({
            mensagem: "Email já cadastrado"
        })
    }

    const senhaHash = await bcrypt.hash(
        senha,
        10
    )

    const novoUsuario = await prisma.usuario.create({
        data: {
            nome: nome,
            email: email,
            senha: senhaHash
        }
    })

    return res.status(201).json({
        "mensagem": "recurso criado com sucesso",
        "usuario": {
            "id" : novoUsuario.id,
            "nome" : novoUsuario.nome,
            "email" : novoUsuario.email,
            "cargo" : novoUsuario.cargo,
            "dataDeCriacao" : novoUsuario.dataDeCricao
        }
    })
        
})



app.listen(3000, () => {
    console.log('servidor rodando na porta 3000')
})