'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { AlertTriangle, Star, RotateCcw } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import ProtoCard from '@/components/ProtoCard/ProtoCard';
import { PROTOCOLO_MASTER, MAPA_SUGESTAO, getProtocoloPorSlug } from '@/lib/protocolos';

function ResultadoContent() {
  const params = useSearchParams();
  const queixa = params.get('queixa') ?? '';
  const sinaisStr = params.get('sinais') ?? '';
  const intensidade = Number(params.get('intensidade') ?? 5);
  const sinais = sinaisStr ? sinaisStr.split(',') : [];

  const mapeamento = MAPA_SUGESTAO[queixa];
  const protocoloEspecifico = mapeamento ? getProtocoloPorSlug(mapeamento.main) : null;
  const protocoloComplementar = mapeamento && sinais.length >= 3
    ? getProtocoloPorSlug(mapeamento.complementar)
    : null;

  function gerarLeituraFisiologica(): string {
    const partes: string[] = [];
    if (sinais.includes('Predomínio simpático') || sinais.includes('Ansiedade'))
      partes.push('hiperativação do eixo HPA com predomínio simpático');
    if (sinais.includes('Sono ruim'))
      partes.push('disrupção do ciclo circadiano com comprometimento do sono');
    if (sinais.includes('Fadiga'))
      partes.push('esgotamento adrenal e baixa resiliência ao estresse');
    if (sinais.includes('Oscilações hormonais') || sinais.includes('Fogachos'))
      partes.push('desequilíbrio do eixo neuroendócrino gonadal');
    if (sinais.includes('Tensão muscular'))
      partes.push('espasmo reflexo com amplificação simpática periférica');
    if (sinais.includes('Inflamação recorrente'))
      partes.push('ativação crônica do eixo neuroinflamatório');
    if (partes.length === 0) return 'Padrão de desregulação sistêmica com indicação de regulação do SNA.';
    return `O quadro sugere ${partes.join(', ')}.`;
  }

  return (
    <div className="space-y-5">
      {/* Resumo da avaliação */}
      <div className="card p-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>Avaliação realizada</p>
        <p className="text-sm"><strong>Queixa:</strong> {queixa}</p>
        {sinais.length > 0 && (
          <p className="text-sm"><strong>Sinais:</strong> {sinais.join(', ')}</p>
        )}
        <p className="text-sm"><strong>Intensidade:</strong> {intensidade}/10</p>
        <div className="mt-2 p-3 rounded-[10px]" style={{ backgroundColor: 'var(--cream)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--forest)' }}>Leitura neurofisiológica</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{gerarLeituraFisiologica()}</p>
        </div>
      </div>

      {/* Protocolo Master — sempre primeiro */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Star size={14} style={{ color: 'var(--gold)' }} />
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--gold)' }}>
            1º — Base obrigatória para qualquer protocolo
          </p>
        </div>
        <ProtoCard protocolo={PROTOCOLO_MASTER} expandidoPorPadrao={false} />
      </div>

      {/* Protocolo específico */}
      {protocoloEspecifico && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--forest)' }}>
            2º — Protocolo específico para {queixa}
          </p>
          <ProtoCard protocolo={protocoloEspecifico} expandidoPorPadrao />
        </div>
      )}

      {/* Protocolo complementar */}
      {protocoloComplementar && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--gray)' }}>
            3º — Protocolo complementar (sinais múltiplos detectados)
          </p>
          <ProtoCard protocolo={protocoloComplementar} />
        </div>
      )}

      {/* Aviso clínico */}
      <div className="aviso-clinico flex gap-2">
        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
        <span>
          Esta sugestão é um apoio ao raciocínio clínico e não substitui avaliação profissional individualizada.
          O julgamento clínico do terapeuta é sempre determinante.
        </span>
      </div>

      {/* Nova avaliação */}
      <Link href="/avaliacao" className="btn-secondary w-full justify-center">
        <RotateCcw size={16} />
        Nova avaliação
      </Link>

      <div className="pb-4" />
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <div>
      <AppHeader
        titulo="Protocolo Sugerido"
        subtitulo="Baseado nos sinais informados"
        voltar
        voltarHref="/avaliacao"
      />
      <div className="px-4 py-5">
        <Suspense fallback={<div className="text-center py-12" style={{ color: 'var(--gray)' }}>Carregando...</div>}>
          <ResultadoContent />
        </Suspense>
      </div>
    </div>
  );
}
