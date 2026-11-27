import { Link } from 'react-router-dom'
import './QuadroChamados.css'

const colunas = [
  { status: 'ABERTO', titulo: 'Abertos', classe: 'aberto' },
  { status: 'CONCLUIDO', titulo: 'Concluídos', classe: 'concluido' },
  { status: 'FECHADO', titulo: 'Fechados', classe: 'fechado' }
]

function QuadroChamados({ chamados, filtroStatus }) {
  const visiveis = colunas.filter(
    (coluna) => filtroStatus === 'TODOS' || coluna.status === filtroStatus
  )
  return (
    <div
      className={`quadro-chamados ${visiveis.length === 1 ? 'quadro-unico' : ''}`}
    >
      {visiveis.map((coluna) => {
        const itens = chamados.filter(
          (chamado) => chamado.status === coluna.status
        )
        return (
          <section
            className={`quadro-coluna coluna-${coluna.classe}`}
            key={coluna.status}
            aria-labelledby={`coluna-${coluna.status}`}
          >
            <header className="coluna-cabecalho">
              <h2 id={`coluna-${coluna.status}`}>
                <span className="coluna-ponto" />
                {coluna.titulo}
              </h2>
              <span
                className="coluna-contador"
                aria-label={`${itens.length} chamados`}
              >
                {itens.length}
              </span>
            </header>
            <div className="coluna-cartoes">
              {itens.map((chamado) => (
                <Link
                  className="quadro-cartao"
                  to={`/chamados/${chamado.id}`}
                  key={chamado.id}
                >
                  <div className="cartao-topo">
                    <span>#{String(chamado.id).padStart(3, '0')}</span>
                    <span className="cartao-tipo">{chamado.tipoAjuda}</span>
                  </div>
                  <h3>{chamado.titulo}</h3>
                  <p className="cartao-descricao">{chamado.descricao}</p>
                  <div className="cartao-pessoas">
                    <span>
                      Solicitante{' '}
                      <strong>
                        {chamado.usuario?.nome || 'Não informado'}
                      </strong>
                    </span>
                    <span>
                      Técnico{' '}
                      <strong>
                        {chamado.tecnico?.nome || 'Não atribuído'}
                      </strong>
                    </span>
                  </div>
                  <footer className="cartao-rodape">
                    <time dateTime={chamado.dataDeCriacao}>
                      {new Date(chamado.dataDeCriacao).toLocaleDateString(
                        'pt-BR'
                      )}
                    </time>
                    <span>
                      Ver detalhes <span aria-hidden="true">↗</span>
                    </span>
                  </footer>
                </Link>
              ))}
              {itens.length === 0 && (
                <p className="coluna-vazia">Nenhum chamado nesta coluna.</p>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default QuadroChamados
