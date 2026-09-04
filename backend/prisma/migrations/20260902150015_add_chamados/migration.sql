-- CreateTable
CREATE TABLE "Chamado" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipoAjuda" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ABERTO',
    "descricaoSolucao" TEXT,
    "dataDeCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chamado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
