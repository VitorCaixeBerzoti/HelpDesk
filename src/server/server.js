import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { prisma } from './lib/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'node:path'
import fs from 'node:fs'

const app = express()
const api = express.Router()

function textoValido(valor) {
    return typeof valor === 'string' && valor.trim().length > 0
}

api.param('id', (req, res, next, id) => {
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
        return res.status(400).json({ mensagem: 'Identificador inválido' })
    }
    next()
})

if (!process.env.JWT_SECRET) throw new Error('Configure JWT_SECRET no .env')

api.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`
        res.json({ status: 'ok' })
    } catch {
        res.status(503).json({ status: 'indisponivel' })
    }
})

const origensPermitidas = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: origensPermitidas
}))

app.use(express.json())

function autenticarToken(req, res, next) {

    const authHearder = req.headers.authorization

    if(!authHearder) {
        return res.status(401).json({
            mensagem: "Token não informado"
        })
    }

    const token = authHearder.split(' ')[1]

    if(!token){
        return res.status(401).json({
            mensagem: "Token não Informado"
        })
    }

    try{
        const dados = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = dados
        next()
    } catch {
        return res.status(401).json({
            mensagem: 'Token invalido ou expirado'
        })
    }

}

api.get('/perfil', autenticarToken, (req, res) => {
    return res.status(200).json({
        usuario: req.usuario
    })
})

function autorizarAdmin(req, res, next) {
    if(req.usuario.cargo !== "ADMIN") {
        return res.status(403).json({
            mensagem: "Voce não tem a permissão para fazer isso",
            
        })
    }
    next()
}

api.post('/usuarios', autenticarToken, autorizarAdmin, async (req, res) => {
    const { nome, email, senha, cargo = 'USUARIO' } = req.body || {}

    if (![nome, email, senha].every(textoValido)) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos'
        })
    }

    if (!['USUARIO', 'TECNICO', 'ADMIN'].includes(cargo)) {
        return res.status(400).json({ mensagem: 'Cargo inválido' })
    }
    if (!email.includes('@') || senha.length < 6) {
        return res.status(400).json({ mensagem: 'Informe um email válido e uma senha de pelo menos 6 caracteres' })
    }

    const usuarioExistente = await prisma.usuario.findUnique({
        where: {
            email
        }
    })

    if (usuarioExistente) {
        return res.status(409).json({
            mensagem: 'Email já cadastrado'
        })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const novoUsuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            senha: senhaHash,
            cargo
        }
    })

    return res.status(201).json({
        mensagem: 'Usuário criado com sucesso',
        usuario: {
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            cargo: novoUsuario.cargo,
            dataDeCriacao: novoUsuario.dataDeCriacao
        }
    })
})



api.get('/', (req, res) => {
    res.send('backend do HelpDesk funcionando!')
})

api.post('/login', async (req, res) => {
    const { email, senha } = req.body || {}

    if (![email, senha].every(textoValido)) {
        return res.status(400).json({ mensagem: 'Preencha o email e a senha' })
    }

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

    const token = jwt.sign(
        {
            id: usuario.id,
            cargo: usuario.cargo
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '8h'
        }
    )
    return res.status(200).json({
        mensagem: 'Login realizado com sucesso',
        token
    })
})

api.post('/chamados', autenticarToken, async (req,res) => {
    const { titulo, descricao, tipoAjuda } = req.body || {}

    if(![titulo, descricao, tipoAjuda].every(textoValido)) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos"
        })
    }

    const novoChamado = await prisma.chamado.create({
        data: {
            usuarioId: req.usuario.id,
            titulo,
            descricao,
            tipoAjuda
        }
    })
    return res.status(201).json({
        mensagem: 'Chamado criado com sucesso',
        chamado: novoChamado
    })
})

api.get('/chamados', autenticarToken, async (req, res) => {
    const chamados = await prisma.chamado.findMany({
        where: req.usuario.cargo === 'USUARIO' ? { usuarioId: req.usuario.id } : {},
        include: {
            usuario: { select: { id: true, nome: true } },
            tecnico: { select: { id: true, nome: true } }
        },
        orderBy: { dataDeCriacao: 'desc' }
    })

    return res.status(200).json({ chamados })
})

api.get('/chamados/:id', autenticarToken, async (req, res) => {
    const { id } = req.params
    const chamadoId = Number(id)

    const chamado = await prisma.chamado.findUnique({
        where: {
            id: chamadoId
        },
        include: {
            usuario: { select: { id: true, nome: true } },
            tecnico: { select: { id: true, nome: true } }
        }
    })
    if (!chamado) {
        return res.status(404).json({
            mensagem: "Chamado não encontrado"
        })
    }

    if (
        req.usuario.cargo === 'USUARIO' &&
        chamado.usuarioId !== req.usuario.id
    ) {
        return res.status(403).json({
            mensagem: "Acesso negado"
        })
    }
    return res.status(200).json({
        chamado
    })
})

api.patch('/chamados/:id', autenticarToken, async (req, res) => {
    const { id } = req.params
    const chamadoId = Number(id)
    const { status, descricaoSolucao } = req.body || {}
    const statusPermitidos = ['ABERTO', 'FECHADO', 'CONCLUIDO']

    if (!['ADMIN', 'TECNICO'].includes(req.usuario.cargo)) {
        return res.status(403).json({ mensagem: 'Acesso negado' })
    }

    if(status !== undefined && !statusPermitidos.includes(status)) {
        return res.status(400).json({
            mensagem: "Status inválido"
        })
    }

    if (descricaoSolucao !== undefined && typeof descricaoSolucao !== 'string') {
        return res.status(400).json({ mensagem: 'Solução inválida' })
    }

    const chamado = await prisma.chamado.findUnique({
        where: {
            id: chamadoId
        },
        include: {
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true
                }
            },
            tecnico: {
                select: {
                    id: true,
                    nome: true,
                    email: true
                }
            }
        }
    })

    if (!chamado) {
        return res.status(404).json({
            mensagem: "Chamado não encontrado"
        })
    }

    if ((status || chamado.status) === 'CONCLUIDO' && !textoValido(descricaoSolucao ?? chamado.descricaoSolucao)) {
        return res.status(400).json({
            mensagem: 'Informe a solução do chamado'
        })
    }

    const chamadoAtualizado = await prisma.chamado.update({
        where: {
            id: chamadoId
        },
        data: {
            status,
            descricaoSolucao
        }

    })
    
    return res.status(200).json({
        mensagem: 'Chamado atualizado com sucesso',
        chamado: chamadoAtualizado
    })
})

api.patch('/chamados/:id/assumir', autenticarToken, async (req, res) => {
    const { id } = req.params
    const chamadoId = Number(id)
    
    if(!['ADMIN', 'TECNICO'].includes(req.usuario.cargo)) {
        return res.status(403).json({
            mensagem: "Acesso negado"
        })
    }

    const chamado = await prisma.chamado.findUnique({
        where: {
            id: chamadoId
        }
    })
    
    if (!chamado) {
        return res.status(404).json({
            mensagem: 'Chamado não encontrado'
        })
    }

    if(chamado.tecnicoId) {
        return res.status(400).json({
            mensagem: 'Chamado já possui técnico responsável'
        })
    }

    const chamadoAtualizado = await prisma.chamado.update({
        where: {
            id: chamadoId
        }, 
        data: {
            tecnicoId: req.usuario.id
        }
    })

    return res.status(200). json({
        mensagem: 'Chamado assumido com sucesso',
        chamado: chamadoAtualizado
    })

})

api.get('/usuarios', autenticarToken, autorizarAdmin, async (req, res) => {
    const usuarios = await prisma.usuario.findMany({
        select: {
            id: true,
            nome: true,
            email: true,
            cargo: true,
            dataDeCriacao: true
        },
        orderBy: {
            nome: 'asc'
        }
    })

    return res.status(200).json({
        usuarios
    })
})

app.use('/api', api)
app.use('/api', (req, res) => {
    res.status(404).json({ mensagem: 'Rota não encontrada' })
})

const dist = path.resolve(import.meta.dirname, '../../dist')
if (fs.existsSync(path.join(dist, 'index.html'))) {
    app.use(express.static(dist))
    app.get('/{*pagina}', (req, res, next) => {
        if (path.extname(req.path)) return next()
        res.sendFile(path.join(dist, 'index.html'))
    })
}

app.use((erro, req, res, next) => {
    if (res.headersSent) return next(erro)
    if (erro.code === 'P2002') return res.status(409).json({ mensagem: 'Registro já cadastrado' })
    if (erro.type === 'entity.parse.failed') return res.status(400).json({ mensagem: 'JSON inválido' })
    console.error('Falha na API:', erro.code || erro.name)
    res.status(500).json({ mensagem: 'Não foi possível processar a solicitação. Tente novamente.' })
})

const PORT = process.env.PORT || 3000
const servidor = app.listen(PORT, '0.0.0.0', () => {
    console.log(`HelpDesk disponível na porta ${PORT}`)
})

function encerrar() {
    servidor.close(async () => {
        await prisma.$disconnect()
        process.exit(0)
    })
    setTimeout(() => process.exit(1), 10000).unref()
}
process.on('SIGTERM', encerrar)
process.on('SIGINT', encerrar)
