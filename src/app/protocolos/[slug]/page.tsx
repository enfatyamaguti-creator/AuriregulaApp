import { notFound } from 'next/navigation';
import { AlertTriangle, Clock, Star } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import MapaAuricular from '@/components/MapaAuricular/MapaAuricular';
import { getProtocoloPorSlug, PROTOCOLOS } from '@/lib/protocolos';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return PROTOCOLOS.map(p => ({ slug: p.slug }));
}

export default async function DetalheProtocolo({ params }: Props) {
  const { slug } = await params;
  const protocolo = getProtocoloPorSlug(slug);
  if (!protocolo) notFound();

  const corHeader = protocolo.corTema === 'rose' ? 'rose' : protocolo.corTema === 'purple' ? 'forest' : protocolo.isMaster ? 'amber' : 'forest';

  return (
    <div>
      <AppHeader
        titulo={protocolo.isMaster ? 'Protocolo Master' : protocolo.nome}
        subtitulo={protocolo.categoria}
        variante={corHeader}
        voltar
        voltarHref="/protocolos"
      />

      <div className="px-4 md:px-8 py-5 md:py-6 space-y-5 w-full max-w-4xl mx-auto">
        {/* Badge master */}
        {protocolo.isMaster && (
          <div
            className="flex items-center gap-2 p-3 rounded-[12px]"
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-light))' }}
          >
            <Star size={16} fill="white" color="white" />
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wide">Base Universal — Método R.E.G.U.L.A.®</p>
              <p className="text-xs text-white opacity-80">Sempre aplicar antes dos protocolos específicos</p>
            </div>
          </div>
        )}

        {/* Mapa Auricular */}
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--gray)' }}>
            Mapa Auricular Interativo
          </p>
          <MapaAuricular pontos={protocolo.pontos} exibirLegenda />
        </div>

        {/* Indicação e Objetivo */}
        <div className="card p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--gray)' }}>Indicação</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{protocolo.indicacao}</p>
          </div>
          <div className="h-px" style={{ backgroundColor: 'var(--border-card)' }} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--gray)' }}>Objetivo terapêutico</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{protocolo.objetivo}</p>
          </div>
        </div>

        {/* Sinais associados */}
        {protocolo.sinais.length > 0 && (
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2.5" style={{ color: 'var(--gray)' }}>Sinais de desregulação associados</p>
            <div className="flex flex-wrap gap-1.5">
              {protocolo.sinais.map(s => (
                <span key={s} className="pill">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Racional neurofisiológico */}
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--gray)' }}>Racional Neurofisiológico</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{protocolo.racional}</p>
        </div>

        {/* Frequência */}
        <div className="p-4 rounded-[14px] flex items-start gap-3" style={{ backgroundColor: 'var(--gold-pale)' }}>
          <Clock size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: 'var(--gold)' }}>Frequência sugerida</p>
            <p className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>{protocolo.frequencia}</p>
          </div>
        </div>

        {/* Observações */}
        {protocolo.observacoes && (
          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--gray)' }}>Observações clínicas</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{protocolo.observacoes}</p>
          </div>
        )}

        {/* Cuidados */}
        {protocolo.cuidados && (
          <div className="aviso-clinico flex gap-2">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
            <div>
              <p className="font-semibold text-xs mb-0.5">Cuidados e contraindicações</p>
              {protocolo.cuidados}
            </div>
          </div>
        )}

        {/* Aviso população especial gestante */}
        {protocolo.populacao === 'gestante' && (
          <div className="aviso-critico">
            <AlertTriangle size={14} className="inline mr-1.5" />
            <strong>CONTRAINDICADOS:</strong> pontos Útero, Ovário, Lombossacro, Pélvis. Sempre com liberação obstétrica documentada.
          </div>
        )}

        {/* Aviso oncologia */}
        {protocolo.populacao === 'oncologia' && (
          <div className="aviso-critico">
            <AlertTriangle size={14} className="inline mr-1.5" />
            <strong>Oncologia:</strong> comunicação obrigatória com oncologista responsável. Uso exclusivo como suporte paliativo à qualidade de vida.
          </div>
        )}

        {/* Aviso clínico obrigatório */}
        <div className="aviso-clinico">
          Esta sugestão é um apoio ao raciocínio clínico e não substitui avaliação profissional individualizada.
          O julgamento clínico do terapeuta é sempre determinante na escolha e adaptação do protocolo.
        </div>

        <div className="pb-4" />
      </div>
    </div>
  );
}
