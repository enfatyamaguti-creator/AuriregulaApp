'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import { Heart, Copy, FileText, ChevronDown, ChevronUp, AlertTriangle, Star } from 'lucide-react';
import MapaAuricular from '@/components/MapaAuricular/MapaAuricular';
import type { Protocolo } from '@/types';
import { cn } from '@/lib/utils';

const AVISOS_POPULACAO: Record<string, string> = {
  gestante: 'CONTRAINDICADOS nesta população: pontos Útero, Ovário, Lombossacro, Pélvis. Sempre com liberação obstétrica.',
  pediatria: 'Protocolos para crianças exigem técnica adaptada (laser ou semissólio), sessões curtas e consentimento dos responsáveis.',
  oncologia: 'Comunicação com oncologista obrigatória. Uso exclusivo como suporte paliativo à qualidade de vida.',
};

const COR_TEMA_STYLES: Record<string, { badge: string; badgeText: string; border: string }> = {
  forest: { badge: 'rgba(26,58,42,0.10)',  badgeText: '#1a3a2a', border: 'rgba(26,58,42,0.12)' },
  rose:   { badge: 'rgba(139,58,82,0.10)', badgeText: '#8b3a52', border: 'rgba(139,58,82,0.15)' },
  amber:  { badge: 'rgba(184,151,74,0.12)',badgeText: '#b8974a', border: 'rgba(184,151,74,0.20)' },
  teal:   { badge: 'rgba(15,110,86,0.10)', badgeText: '#0f6e56', border: 'rgba(15,110,86,0.15)' },
  purple: { badge: 'rgba(99,60,140,0.10)', badgeText: '#633c8c', border: 'rgba(99,60,140,0.18)' },
};

interface Props {
  protocolo: Protocolo;
  expandidoPorPadrao?: boolean;
  compacto?: boolean;
  onFavoritar?: (id: string) => void;
  favoritado?: boolean;
}

const ProtoCard = memo(function ProtoCard({ protocolo, expandidoPorPadrao = false, compacto = false, onFavoritar, favoritado }: Props) {
  const [expandido, setExpandido] = useState(expandidoPorPadrao);
  const [copiado, setCopiado] = useState(false);

  const estilos = COR_TEMA_STYLES[protocolo.corTema] ?? COR_TEMA_STYLES.forest;

  async function copiarPontos() {
    const texto = `${protocolo.nome}\n\nPontos:\n${protocolo.pontos.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nFrequência: ${protocolo.frequencia}`;
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <article
      className="card overflow-hidden fade-in"
      style={{ borderColor: protocolo.isMaster ? 'var(--gold)' : estilos.border, borderWidth: protocolo.isMaster ? 2 : 1 }}
    >
      {/* Cabeçalho Master */}
      {protocolo.isMaster && (
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-light))' }}>
          <Star size={14} fill="white" color="white" />
          <span className="text-xs font-semibold text-white tracking-wide uppercase">Protocolo Base Universal — Método R.E.G.U.L.A.®</span>
        </div>
      )}

      {/* Header do card */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span
              className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5"
              style={{ backgroundColor: estilos.badge, color: estilos.badgeText }}
            >
              {protocolo.categoria}
            </span>
            <h2
              className="font-display font-semibold text-lg leading-tight"
              style={{ color: 'var(--charcoal)' }}
            >
              {protocolo.nome}
            </h2>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--gray)' }}>
              {protocolo.indicacao}
            </p>
          </div>

          {onFavoritar && (
            <button
              onClick={() => onFavoritar(protocolo.id)}
              className="p-1.5 rounded-[8px] flex-shrink-0 transition-all active:scale-90"
              style={{ color: favoritado ? 'var(--rose)' : 'var(--gray-light)' }}
            >
              <Heart size={18} fill={favoritado ? 'var(--rose)' : 'none'} />
            </button>
          )}
        </div>

        {/* Mapa Auricular compacto */}
        {!compacto && (
          <div className="mt-3">
            <MapaAuricular pontos={protocolo.pontos} exibirLegenda={false} compacto />
          </div>
        )}

        {/* Objetivo */}
        <div className="mt-3 p-3 rounded-[10px]" style={{ backgroundColor: 'var(--cream)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: estilos.badgeText }}>Objetivo</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{protocolo.objetivo}</p>
        </div>
      </div>

      {/* Toggle expandir */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-medium border-t transition-colors"
        style={{ borderColor: estilos.border, color: 'var(--gray)', backgroundColor: expandido ? 'var(--cream)' : 'transparent' }}
      >
        <span>{expandido ? 'Menos detalhes' : 'Ver racional e cuidados'}</span>
        {expandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Conteúdo expandido */}
      {expandido && (
        <div className="px-4 pb-4 space-y-3 fade-in">
          {/* Sinais */}
          {protocolo.sinais.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--gray)' }}>Sinais associados</p>
              <div className="flex flex-wrap gap-1.5">
                {protocolo.sinais.map(s => (
                  <span key={s} className="pill">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Racional */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--gray)' }}>Racional neurofisiológico</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{protocolo.racional}</p>
          </div>

          {/* Frequência */}
          <div className="p-3 rounded-[10px]" style={{ backgroundColor: 'var(--gold-pale)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--gold)' }}>Frequência sugerida</p>
            <p className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>{protocolo.frequencia}</p>
          </div>

          {/* Observações e Cuidados */}
          {protocolo.observacoes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--gray)' }}>Observações clínicas</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{protocolo.observacoes}</p>
            </div>
          )}

          {protocolo.cuidados && (
            <div className="aviso-clinico">
              <AlertTriangle size={12} className="inline mr-1" />
              <span className="font-semibold">Cuidados: </span>
              {protocolo.cuidados}
            </div>
          )}

          {/* Aviso população especial */}
          {protocolo.populacao && AVISOS_POPULACAO[protocolo.populacao] && (
            <div className="aviso-critico">
              <AlertTriangle size={12} className="inline mr-1" />
              {AVISOS_POPULACAO[protocolo.populacao]}
            </div>
          )}

          {/* Aviso clínico obrigatório */}
          <div className="aviso-clinico">
            Esta sugestão é um apoio ao raciocínio clínico e não substitui avaliação profissional individualizada.
            O julgamento clínico do terapeuta é sempre determinante na escolha e adaptação do protocolo.
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="px-4 py-3 flex gap-2 border-t" style={{ borderColor: estilos.border }}>
        <button
          onClick={copiarPontos}
          className="btn-secondary flex-1 text-xs py-2"
        >
          <Copy size={13} />
          {copiado ? 'Copiado!' : 'Copiar pontos'}
        </button>
        <Link
          href={`/protocolos/${protocolo.slug}`}
          className="btn-primary flex-1 text-xs py-2"
          style={{ backgroundColor: estilos.badgeText }}
        >
          <FileText size={13} />
          Ver completo
        </Link>
      </div>
    </article>
  );
});

export default ProtoCard;
