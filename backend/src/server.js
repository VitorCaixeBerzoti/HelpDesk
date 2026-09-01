import express from 'express'
import cors from 'cors'
import { prisma } from './lib/prisma.js'

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
    if(senha !== usuario.senha) {
        return res.status(401).json({
            mensagem: 'Email ou senha incorretos'
        })
    }

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso'
        })
})

app.listen(3000, () => {
    console.log('servidor rodando na porta 3000')
})