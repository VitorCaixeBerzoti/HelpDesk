import 'dotenv/config'
import bcrypt from 'bcrypt'
import { prisma } from '../src/lib/prisma.js'

async function main() {
    const nome = process.env.SEED_ADMIN_NOME
    const email = process.env.SEED_ADMIN_EMAIL
    const senha = process.env.SEED_ADMIN_SENHA

    if(!nome || !email || !senha) {
        throw new Error('Preencha os dados do ADMIN no .env')
    }

    const senhaHash = await bcrypt.hash(
        senha,
        10
        )
    await prisma.usuario.upsert({
        where: {
            email
        },
        update: {
            nome,
            senha: senhaHash,
            cargo: 'ADMIN'
        },
        create: {
            nome,
            email,
            senha: senhaHash,
            cargo: 'ADMIN'
        }
    })

}

main()
    .then(() => {
        console.log('Seed executado com sucesso')
    })
    .catch((erro) => {
        console.error(erro)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })