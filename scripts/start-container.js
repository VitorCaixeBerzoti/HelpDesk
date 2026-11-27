import { spawnSync } from 'node:child_process'

for (const args of [
  ['node_modules/prisma/build/index.js', 'migrate', 'deploy'],
  ['prisma/seed.js']
]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' })
  if (result.error || result.status !== 0) {
    console.error('Não foi possível preparar o banco de dados.')
    process.exit(result.status || 1)
  }
}

await import('../src/server/server.js')
