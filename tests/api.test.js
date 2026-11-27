import 'dotenv/config'
import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { prisma } from '../src/server/lib/prisma.js'

// Execução explícita contra o Compose local. Limpa somente os registros deste teste.
test('login, perfis, cadastro e atendimento no ambiente local', async () => {
  const base = `http://127.0.0.1:${process.env.APP_PORT || 8081}`
  const identificador = randomUUID()
  const usuariosCriados = []
  const chamadosCriados = []
  const senha = `Teste-${identificador}`

  async function request(caminho, { token, method = 'GET', body } = {}) {
    const response = await fetch(`${base}/api${caminho}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000)
    })
    return { status: response.status, data: await response.json() }
  }

  try {
    assert.equal((await request('/health')).status, 200)
    assert.equal((await request('/chamados')).status, 401)
    assert.equal((await request('/login', { method: 'POST', body: {} })).status, 400)
    const login = await request('/login', {
      method: 'POST',
      body: { email: process.env.SEED_ADMIN_EMAIL, senha: process.env.SEED_ADMIN_SENHA }
    })
    assert.equal(login.status, 200)
    const admin = login.data.token

    async function criarUsuario(cargo, nome) {
      const email = `${nome}-${identificador}@helpdesk.test`
      const resposta = await request('/usuarios', {
        token: admin, method: 'POST', body: { nome, email, senha, cargo }
      })
      assert.equal(resposta.status, 201)
      usuariosCriados.push(resposta.data.usuario.id)
      assert.equal(resposta.data.usuario.cargo, cargo)
      assert.equal('senha' in resposta.data.usuario, false)
      const autenticacao = await request('/login', { method: 'POST', body: { email, senha } })
      assert.equal(autenticacao.status, 200)
      return { ...resposta.data.usuario, token: autenticacao.data.token }
    }

    const solicitante = await criarUsuario('USUARIO', 'Solicitante')
    const outro = await criarUsuario('USUARIO', 'Outro')
    const tecnico = await criarUsuario('TECNICO', 'Tecnico')
    const usuarios = await request('/usuarios', { token: admin })
    assert.equal(usuarios.status, 200)
    assert.ok(usuarios.data.usuarios.every(usuario => !('senha' in usuario)))
    assert.equal((await request('/usuarios', { token: solicitante.token })).status, 403)
    assert.equal((await request('/usuarios', { token: tecnico.token })).status, 403)

    const criado = await request('/chamados', {
      token: solicitante.token, method: 'POST',
      body: { titulo: `Teste ${identificador}`, descricao: 'Teste automatizado temporário', tipoAjuda: 'Software', usuarioId: outro.id }
    })
    assert.equal(criado.status, 201)
    const id = criado.data.chamado.id
    chamadosCriados.push(id)
    assert.equal(criado.data.chamado.usuarioId, solicitante.id)
    assert.equal(criado.data.chamado.status, 'ABERTO')
    assert.equal((await request(`/chamados/${id}`, { token: outro.token })).status, 403)
    assert.equal((await request(`/chamados/${id}`, { token: outro.token, method: 'PATCH', body: { status: 'FECHADO' } })).status, 403)
    assert.equal((await request(`/chamados/${id}`, { token: solicitante.token, method: 'PATCH', body: { status: 'FECHADO' } })).status, 403)
    const intacto = await request(`/chamados/${id}`, { token: admin })
    assert.equal(intacto.data.chamado.status, 'ABERTO')
    assert.equal(intacto.data.chamado.usuario.nome, 'Solicitante')

    const privados = await request('/chamados', { token: outro.token })
    assert.ok(!privados.data.chamados.some(chamado => chamado.id === id))
    for (const token of [solicitante.token, tecnico.token, admin]) {
      const lista = await request('/chamados', { token })
      assert.ok(lista.data.chamados.some(chamado => chamado.id === id))
    }
    assert.equal((await request(`/chamados/${id}/assumir`, { token: solicitante.token, method: 'PATCH' })).status, 403)
    assert.equal((await request(`/chamados/${id}/assumir`, { token: tecnico.token, method: 'PATCH' })).status, 200)
    assert.equal((await request(`/chamados/${id}/assumir`, { token: admin, method: 'PATCH' })).status, 400)
    assert.equal((await request(`/chamados/${id}`, { token: tecnico.token, method: 'PATCH', body: { status: 'CONCLUIDO', descricaoSolucao: '  ' } })).status, 400)
    assert.equal((await request(`/chamados/${id}`, { token: tecnico.token, method: 'PATCH', body: { status: 'INVALIDO' } })).status, 400)
    assert.equal((await request(`/chamados/${id}`, { token: tecnico.token, method: 'PATCH', body: { status: 'CONCLUIDO', descricaoSolucao: 'Problema resolvido' } })).status, 200)
    const concluido = await request(`/chamados/${id}`, { token: solicitante.token })
    assert.equal(concluido.data.chamado.status, 'CONCLUIDO')
    assert.equal(concluido.data.chamado.tecnico.nome, 'Tecnico')
    assert.equal((await request('/chamados/invalido', { token: admin })).status, 400)
    assert.equal((await request('/nao-existe')).status, 404)
  } finally {
    await prisma.chamado.deleteMany({ where: { id: { in: chamadosCriados }, titulo: `Teste ${identificador}` } })
    await prisma.usuario.deleteMany({ where: { id: { in: usuariosCriados }, email: { endsWith: `${identificador}@helpdesk.test` } } })
    await prisma.$disconnect()
  }
})
