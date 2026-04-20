'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { QUEIXAS_PRINCIPAIS, SINAIS_DESREGULACAO } from '@/lib/protocolos';

export default function AvaliacaoClinica() {
  const router = useRouter();
  const [queixa, setQueixa] = useState('');
  const [sinais, setSinais] = useState<string[]>([]);
  const [intensidade, setIntensidade] = useState(5);
  const [etapa, setEtapa] = useState(1);

  function toggleSinal(s: string) {
    setSinais(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function avancar() {
    if (etapa === 1 && !queixa) return;
    if (etapa < 3) {
      setEtapa(e => e + 1);
      return;
    }
    const params = new URLSearchParams({
      queixa,
      sinais: sinais.join(','),
      intensidade: String(intensidade),
    });
    router.push(`/avaliacao/resultado?${params}`);
  }

  return (
    <div className="fade-in">
      {/* Barra de progresso */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(n => (
          <div
            key={n}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{
              backgroundColor: n <= etapa ? 'var(--forest)' : 'var(--cream-dark)',
            }}
          />
        ))}
      </div>

      {/* ETAPA 1: Queixa principal */}
      {etapa === 1 && (
        <div className="fade-in space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>
              Queixa principal
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--gray)' }}>
              Selecione a queixa predominante do paciente
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {QUEIXAS_PRINCIPAIS.map(q => (
              <button
                key={q}
                onClick={() => setQueixa(q)}
                className="p-3 rounded-[10px] text-sm font-medium text-left transition-all border"
                style={{
                  backgroundColor: queixa === q ? 'var(--forest)' : 'white',
                  color: queixa === q ? 'white' : 'var(--charcoal)',
                  borderColor: queixa === q ? 'var(--forest)' : 'rgba(26,58,42,0.10)',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ETAPA 2: Sinais de desregulação */}
      {etapa === 2 && (
        <div className="fade-in space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>
              Sinais de desregulação
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--gray)' }}>
              Marque todos que o paciente apresenta
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SINAIS_DESREGULACAO.map(s => (
              <button
                key={s}
                onClick={() => toggleSinal(s)}
                className="pill"
                style={{
                  backgroundColor: sinais.includes(s) ? 'var(--forest)' : 'var(--cream-dark)',
                  color: sinais.includes(s) ? 'white' : 'var(--charcoal)',
                  borderColor: sinais.includes(s) ? 'var(--forest)' : 'transparent',
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {sinais.length > 0 && (
            <p className="text-xs" style={{ color: 'var(--gray)' }}>
              {sinais.length} sinal(is) selecionado(s)
            </p>
          )}
        </div>
      )}

      {/* ETAPA 3: Intensidade */}
      {etapa === 3 && (
        <div className="fade-in space-y-6">
          <div>
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>
              Intensidade dos sintomas
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--gray)' }}>
              Como o paciente avalia a intensidade geral?
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--gray)' }}>Leve</span>
              <span
                className="font-display text-4xl font-bold"
                style={{ color: intensidade >= 7 ? 'var(--rose)' : intensidade >= 4 ? 'var(--gold)' : 'var(--forest)' }}
              >
                {intensidade}
              </span>
              <span className="text-sm" style={{ color: 'var(--gray)' }}>Severo</span>
            </div>

            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={intensidade}
              onChange={e => setIntensidade(Number(e.target.value))}
              className="w-full h-2 rounded-full cursor-pointer appearance-none"
              style={{
                background: `linear-gradient(to right, var(--forest) ${intensidade * 10}%, var(--cream-dark) ${intensidade * 10}%)`,
              }}
            />

            <div className="flex justify-between">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <span key={n} className="text-[10px]" style={{ color: 'var(--gray-light)' }}>{n}</span>
              ))}
            </div>
          </div>

          {/* Resumo */}
          <div className="p-4 rounded-[12px] space-y-2" style={{ backgroundColor: 'var(--cream-dark)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>Resumo da avaliação</p>
            <p className="text-sm"><strong>Queixa:</strong> {queixa}</p>
            {sinais.length > 0 && (
              <p className="text-sm"><strong>Sinais ({sinais.length}):</strong> {sinais.slice(0, 4).join(', ')}{sinais.length > 4 ? '...' : ''}</p>
            )}
            <p className="text-sm"><strong>Intensidade:</strong> {intensidade}/10</p>
          </div>
        </div>
      )}

      {/* Botões de navegação */}
      <div className="flex gap-3 mt-8">
        {etapa > 1 && (
          <button
            onClick={() => setEtapa(e => e - 1)}
            className="btn-secondary flex-1"
          >
            Voltar
          </button>
        )}
        <button
          onClick={avancar}
          disabled={etapa === 1 && !queixa}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {etapa === 3 ? 'Ver protocolo sugerido' : 'Continuar'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
