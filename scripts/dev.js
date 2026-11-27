import { spawn } from 'node:child_process'

const processos = [
  spawn(process.execPath, ['--watch', 'src/server/server.js'], {
    stdio: 'inherit'
  }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], {
    stdio: 'inherit'
  })
]

let encerrando = false
function encerrar(codigo = 0) {
  if (encerrando) return
  encerrando = true
  for (const processo of processos) {
    if (!processo.pid || processo.exitCode !== null) continue
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(processo.pid), '/T', '/F'], {
        stdio: 'ignore',
        windowsHide: true
      })
    } else {
      processo.kill('SIGTERM')
    }
  }
  process.exitCode = codigo
}

for (const processo of processos) {
  processo.on('error', (erro) => {
    console.error(erro)
    encerrar(1)
  })
  processo.on('exit', (codigo) => encerrar(codigo || 0))
}
process.on('SIGINT', () => encerrar())
process.on('SIGTERM', () => encerrar())
