'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PONTOS_AURICULARES, CORES_PONTOS, LABELS_CORES } from '@/lib/pontos-auriculares';
import type { PontoAuricular, CorPonto } from '@/types';

// px/py são percentuais 0–100 da imagem (calibrados via /admin/calibrar)
// viewBox 0 0 100 100 com preserveAspectRatio="none" garante alinhamento perfeito

interface Props {
  pontos: string[];
  exibirLegenda?: boolean;
  compacto?: boolean;
}

export default function MapaAuricular({ pontos, exibirLegenda = true, compacto = false }: Props) {
  const [pontoAtivo, setPontoAtivo] = useState<PontoAuricular | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pontosDoProtocolo = pontos
    .map(nome => PONTOS_AURICULARES[nome])
    .filter(Boolean);

  const coresPresentes = [...new Set(pontosDoProtocolo.map(p => p.cor))] as CorPonto[];

  useEffect(() => {
    function handleClickFora(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPontoAtivo(null);
      }
    }
    document.addEventListener('mousedown', handleClickFora);
    document.addEventListener('touchstart', handleClickFora);
    return () => {
      document.removeEventListener('mousedown', handleClickFora);
      document.removeEventListener('touchstart', handleClickFora);
    };
  }, []);

  function handlePontoClick(ponto: PontoAuricular, e: React.MouseEvent | React.TouchEvent) {
    e.stopPropagation();
    e.preventDefault();
    setPontoAtivo(pontoAtivo?.nome === ponto.nome ? null : ponto);
  }

  const raio      = compacto ? 2.0 : 2.5;
  const raioAtivo = raio + 0.8;

  // Tooltip posicionado diretamente pelas coordenadas % do ponto ativo
  const tipX = pontoAtivo?.px ?? 50;
  const tipY = pontoAtivo?.py ?? 50;

  return (
    <div className="flex flex-col items-center gap-3 w-full">

      {/* Container responsivo — aspect-ratio da imagem original */}
      <div
        ref={containerRef}
        className="relative select-none w-full"
        style={{ aspectRatio: '425 / 390', maxWidth: compacto ? 200 : 340 }}
        onClick={() => setPontoAtivo(null)}
      >
        {/* Imagem base */}
        <Image
          src="/images/ORELHA.png"
          alt="Pavilhão Auricular"
          fill
          className="rounded-lg"
          style={{ objectFit: 'fill' }}
          priority={!compacto}
          loading={compacto ? 'lazy' : 'eager'}
          sizes="(max-width: 480px) 100vw, 340px"
        />

        {/* SVG overlay — coordenadas 0-100 = % da imagem (preserveAspectRatio="none" essencial) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
          aria-hidden="true"
        >
          {pontosDoProtocolo.map((ponto) => {
            const cor     = CORES_PONTOS[ponto.cor];
            const isAtivo = pontoAtivo?.nome === ponto.nome;

            return (
              <g
                key={ponto.nome}
                style={{ cursor: 'pointer' }}
                onClick={(e) => handlePontoClick(ponto, e as unknown as React.MouseEvent)}
                onTouchEnd={(e) => handlePontoClick(ponto, e as unknown as React.TouchEvent)}
                role="button"
                aria-label={ponto.nome}
              >
                {/* Halo pulsante via SVG animate (sem bug de transform-origin) */}
                {isAtivo && (
                  <circle cx={ponto.px} cy={ponto.py} fill="none" stroke={cor} strokeWidth={0.7}>
                    <animate attributeName="r"       from={raio + 0.5} to={raio + 6} dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.65"       to="0"        dur="1.2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Círculo principal */}
                <circle
                  cx={ponto.px}
                  cy={ponto.py}
                  r={isAtivo ? raioAtivo : raio}
                  fill={cor}
                  fillOpacity={isAtivo ? 1 : 0.88}
                  stroke="white"
                  strokeWidth={isAtivo ? 0.9 : 0.55}
                  style={{ filter: isAtivo ? `drop-shadow(0 0 2.5px ${cor})` : 'none' }}
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip semi-transparente */}
        {pontoAtivo && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left:      `${Math.min(Math.max(tipX, 14), 78)}%`,
              top:        tipY > 65 ? 'auto' : `${Math.min(tipY + 7, 72)}%`,
              bottom:     tipY > 65 ? '6%'  : 'auto',
              transform: 'translateX(-50%)',
              maxWidth:   148,
            }}
          >
            <div
              className="rounded-[8px] px-2.5 py-1.5"
              style={{
                backgroundColor:    'rgba(22,18,14,0.86)',
                backdropFilter:      'blur(6px)',
                WebkitBackdropFilter:'blur(6px)',
                border:              '1px solid rgba(255,255,255,0.13)',
                boxShadow:           '0 4px 14px rgba(0,0,0,0.28)',
              }}
            >
              <p
                className="font-semibold text-xs leading-tight"
                style={{ color: CORES_PONTOS[pontoAtivo.cor] === '#1a3a2a' ? '#7fcca0' : CORES_PONTOS[pontoAtivo.cor] }}
              >
                {pontoAtivo.nome}
              </p>
              <p className="text-[10px] mt-0.5 leading-tight" style={{ color: 'rgba(255,255,255,0.62)' }}>
                {pontoAtivo.zona}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legenda de categorias */}
      {exibirLegenda && coresPresentes.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center">
          {coresPresentes.map(cor => (
            <div key={cor} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CORES_PONTOS[cor] }} />
              <span className="text-xs" style={{ color: 'var(--gray)' }}>{LABELS_CORES[cor]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Chips clicáveis dos pontos */}
      {!compacto && pontosDoProtocolo.length > 0 && (
        <div className="w-full flex flex-wrap gap-1.5">
          {pontosDoProtocolo.map((ponto) => (
            <button
              key={ponto.nome}
              onClick={(e) => {
                e.stopPropagation();
                setPontoAtivo(pontoAtivo?.nome === ponto.nome ? null : ponto);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all active:scale-95"
              style={{
                backgroundColor: pontoAtivo?.nome === ponto.nome
                  ? CORES_PONTOS[ponto.cor]
                  : `${CORES_PONTOS[ponto.cor]}18`,
                color:       pontoAtivo?.nome === ponto.nome ? 'white' : CORES_PONTOS[ponto.cor],
                borderColor: `${CORES_PONTOS[ponto.cor]}55`,
              }}
            >
              {ponto.nome}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
