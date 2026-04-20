'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, MapPin, RotateCcw } from 'lucide-react';

// Metadados fixos — zona anatômica e categoria de cada ponto
const PONTOS_META: Record<string, { zona: string; cor: string }> = {
  'Shenmen':               { zona: 'Fossa triangular',                cor: 'main'     },
  'Subcórtex':             { zona: 'Antitrago interno',               cor: 'main'     },
  'Simpático':             { zona: 'Anti-hélix — junção inferior',    cor: 'main'     },
  'Analgesia':             { zona: 'Lóbulo — ponto central',          cor: 'main'     },
  'Nervo Vago':            { zona: 'Concha cymba — zona central',     cor: 'main'     },
  'Coração':               { zona: 'Concha cymba — zona vagal',       cor: 'neuro'    },
  'Ansiedade':             { zona: 'Fossa triangular superior',       cor: 'neuro'    },
  'Occipital':             { zona: 'Antitrago externo posterior',     cor: 'neuro'    },
  'Temporal':              { zona: 'Hélice — junção com antitrago',   cor: 'neuro'    },
  'Tálamo':                { zona: 'Antitrago superior',              cor: 'neuro'    },
  'Sono':                  { zona: 'Fossa triangular interna',        cor: 'neuro'    },
  'Endócrino':             { zona: 'Incisura intertrágo — interno',   cor: 'endoc'    },
  'Hipotálamo':            { zona: 'Antitrago central',               cor: 'endoc'    },
  'Hipófise':              { zona: 'Lóbulo superior interno',         cor: 'endoc'    },
  'Glândula Suprarrenal':  { zona: 'Trago inferior',                  cor: 'endoc'    },
  'Fome':                  { zona: 'Trago inferior lateral',          cor: 'endoc'    },
  'Tireóide':              { zona: 'Antitrago — borda inferior',      cor: 'endoc'    },
  'Pulmão':                { zona: 'Concha cymba superior',           cor: 'visceral' },
  'Fígado':                { zona: 'Concha cymba — zona superior',    cor: 'visceral' },
  'Baço':                  { zona: 'Concha cymba lateral',            cor: 'visceral' },
  'Estômago':              { zona: 'Concha cymba inferior',           cor: 'visceral' },
  'Intestino Grosso':      { zona: 'Concha inferior anterior',        cor: 'visceral' },
  'Rim':                   { zona: 'Concha inferior',                 cor: 'visceral' },
  'Boca':                  { zona: 'Trago inferior medial',           cor: 'visceral' },
  'Cervical':              { zona: 'Anti-hélix — terço superior',     cor: 'col'      },
  'Lombossacro':           { zona: 'Anti-hélix — terço inferior',     cor: 'col'      },
  'Torácica':              { zona: 'Anti-hélix — porção média',       cor: 'col'      },
  'Quadril':               { zona: 'Anti-hélix — cauda inferior',     cor: 'col'      },
  'Ombro':                 { zona: 'Fossa escafoide — superior',      cor: 'col'      },
  'ATM':                   { zona: 'Trago anterior superior',         cor: 'col'      },
  'Masseter':              { zona: 'Trago anterior inferior',         cor: 'col'      },
  'Relaxamento Muscular':  { zona: 'Anti-hélix posterior',            cor: 'col'      },
  'Útero':                     { zona: 'Trígono da fossa triangular',     cor: 'rose'     },
  'Ovário':                    { zona: 'Trígono — borda superior',        cor: 'rose'     },
  'Intestino Delgado':         { zona: 'Concha inferior medial',          cor: 'visceral' },
  'Pâncreas':                  { zona: 'Concha cymba — zona central',     cor: 'visceral' },
  'Joelho':                    { zona: 'Fossa escafoide — inferior',      cor: 'col'      },
  'Lombar':                    { zona: 'Anti-hélix — terço inferior',     cor: 'col'      },
  'Mão':                       { zona: 'Fossa escafoide — superior',      cor: 'col'      },
  'Punho':                     { zona: 'Fossa escafoide — medial',        cor: 'col'      },
  'Cabeça':                    { zona: 'Antitrago — borda inferior',      cor: 'neuro'    },
  'Tronco Cerebral':           { zona: 'Antitrago — zona central',        cor: 'neuro'    },
  'Ponto da queixa principal': { zona: 'Lóbulo — definido na avaliação', cor: 'main'     },
};

const ORDEM = Object.keys(PONTOS_META);

const CORES: Record<string, string> = {
  main: '#1a3a2a', neuro: '#185FA5', endoc: '#854f0b',
  visceral: '#0f6e56', col: '#5F5E5A', rose: '#8b3a52',
};

type Coord = { px: number; py: number };

export default function CalibradorPage() {
  const [coords, setCoords]     = useState<Record<string, Coord>>({});
  const [atual, setAtual]       = useState(ORDEM[0]);
  const [preview, setPreview]   = useState<Coord | null>(null);
  const [copiado, setCopiado]   = useState(false);

  // Clique na imagem → calcula % relativa ao container
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = Math.round(((e.clientX - rect.left) / rect.width)  * 100);
    const py = Math.round(((e.clientY - rect.top)  / rect.height) * 100);
    setPreview({ px, py });
  }

  function confirmar() {
    if (!preview) return;
    setCoords(prev => ({ ...prev, [atual]: preview }));
    const idx = ORDEM.indexOf(atual);
    if (idx < ORDEM.length - 1) setAtual(ORDEM[idx + 1]);
    setPreview(null);
  }

  function remover(nome: string) {
    setCoords(prev => { const n = { ...prev }; delete n[nome]; return n; });
  }

  const calibrados = ORDEM.filter(n => coords[n]);
  const total      = ORDEM.length;
  const progresso  = Math.round((calibrados.length / total) * 100);

  // Gera o bloco TypeScript final pronto para colar no arquivo
  function gerarCodigo(): string {
    const linhas = ORDEM.filter(n => coords[n]).map(n => {
      const { px, py } = coords[n];
      const { zona, cor } = PONTOS_META[n];
      const pad = ' '.repeat(Math.max(1, 24 - n.length));
      return `  '${n}':${pad}{ nome: '${n}',${pad}px: ${String(px).padStart(2)}, py: ${String(py).padStart(2)}, zona: '${zona}', cor: '${cor}' },`;
    });
    return [
      `import type { PontoAuricular } from '@/types';`,
      ``,
      `// Coordenadas calibradas via /admin/calibrar (px/py = % da imagem, 0–100)`,
      `export const PONTOS_AURICULARES: Record<string, PontoAuricular> = {`,
      ...linhas,
      `};`,
      ``,
      `export const CORES_PONTOS: Record<string, string> = {`,
      `  main: '#1a3a2a', neuro: '#185FA5', endoc: '#854f0b',`,
      `  visceral: '#0f6e56', col: '#5F5E5A', rose: '#8b3a52',`,
      `};`,
      ``,
      `export const LABELS_CORES: Record<string, string> = {`,
      `  main: 'Regulatório Central', neuro: 'Neuromodulador', endoc: 'Neuroendócrino',`,
      `  visceral: 'Visceral / Orgânico', col: 'Musculoesquelético', rose: 'Saúde Feminina',`,
      `};`,
      ``,
      `export function getPontosDosNomes(nomes: string[]): PontoAuricular[] {`,
      `  return nomes.map(n => PONTOS_AURICULARES[n]).filter(Boolean);`,
      `}`,
    ].join('\n');
  }

  async function copiar() {
    await navigator.clipboard.writeText(gerarCodigo());
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  }

  const metaAtual = PONTOS_META[atual];

  return (
    <div className="pb-10">
      {/* ── Header ── */}
      <div className="px-4 pt-5 pb-4" style={{ background: 'var(--forest)' }}>
        <h1 className="font-display text-xl font-bold text-white">
          Calibrador de Pontos Auriculares
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Clique na orelha → confirme → copie o arquivo gerado
        </p>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">

        {/* ── Barra de progresso ── */}
        <div className="card p-3">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>
              Progresso
            </span>
            <span className="text-xs font-bold" style={{ color: progresso === 100 ? 'var(--forest)' : 'var(--gold)' }}>
              {calibrados.length} / {total} pontos ({progresso}%)
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--cream-dark)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progresso}%`, background: progresso === 100 ? 'var(--forest)' : 'var(--gold)' }}
            />
          </div>
        </div>

        {/* ── Painel do ponto atual + imagem ── */}
        <div className="card overflow-hidden">

          {/* Cabeçalho do ponto */}
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-card)', background: 'var(--gold-pale)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--gray)' }}>
              Marcando agora
            </p>
            <p className="font-display text-lg font-bold leading-tight" style={{ color: 'var(--forest)' }}>
              {atual}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--gray)' }}>
              {metaAtual.zona}
            </p>
            {preview ? (
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--gold)' }}>
                → px: <strong>{preview.px}</strong>, py: <strong>{preview.py}</strong>
                <span className="ml-1.5 not-italic font-sans font-normal" style={{ color: 'var(--gray-light)' }}>
                  — clique para reposicionar
                </span>
              </p>
            ) : coords[atual] ? (
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--forest)' }}>
                ✓ Salvo: px {coords[atual].px}, py {coords[atual].py}
              </p>
            ) : (
              <p className="text-xs mt-1" style={{ color: 'var(--gray-light)' }}>
                Clique na posição correta na orelha abaixo
              </p>
            )}
          </div>

          {/* Imagem clicável */}
          <div
            className="relative select-none"
            style={{ aspectRatio: '425 / 390', cursor: 'crosshair' }}
            onClick={handleClick}
          >
            <Image
              src="/images/ORELHA.png"
              alt="Pavilhão Auricular"
              fill
              style={{ objectFit: 'fill', pointerEvents: 'none' }}
              priority
            />

            {/* SVG overlay — viewBox 0 0 100 100 = coordenadas em % */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ pointerEvents: 'none' }}
            >
              {/* Pontos já calibrados */}
              {ORDEM.filter(n => coords[n] && n !== atual).map(n => {
                const { px, py } = coords[n];
                const cor = CORES[PONTOS_META[n].cor];
                return (
                  <g key={n}>
                    <circle cx={px} cy={py} r={2.2} fill={cor} stroke="white" strokeWidth={0.7} fillOpacity={0.92} />
                  </g>
                );
              })}

              {/* Preview do ponto atual (dourado com mira) */}
              {preview && (
                <g>
                  <circle cx={preview.px} cy={preview.py} r={4.5} fill="none" stroke="#b8974a" strokeWidth={0.8} strokeDasharray="2 1.5" />
                  <circle cx={preview.px} cy={preview.py} r={2.5} fill="#b8974a" stroke="white" strokeWidth={0.8} />
                  <line x1={preview.px - 6} y1={preview.py} x2={preview.px - 3.5} y2={preview.py} stroke="#b8974a" strokeWidth={0.9} />
                  <line x1={preview.px + 3.5} y1={preview.py} x2={preview.px + 6} y2={preview.py} stroke="#b8974a" strokeWidth={0.9} />
                  <line x1={preview.px} y1={preview.py - 6} x2={preview.px} y2={preview.py - 3.5} stroke="#b8974a" strokeWidth={0.9} />
                  <line x1={preview.px} y1={preview.py + 3.5} x2={preview.px} y2={preview.py + 6} stroke="#b8974a" strokeWidth={0.9} />
                </g>
              )}

              {/* Ponto atual já salvo (com anel de destaque) */}
              {!preview && coords[atual] && (
                <g>
                  <circle cx={coords[atual].px} cy={coords[atual].py} r={4} fill="none" stroke="var(--forest)" strokeWidth={0.9} />
                  <circle cx={coords[atual].px} cy={coords[atual].py} r={2.2} fill="var(--forest)" stroke="white" strokeWidth={0.7} />
                </g>
              )}
            </svg>
          </div>

          {/* Botão confirmar */}
          <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border-card)' }}>
            {preview ? (
              <button onClick={confirmar} className="btn-primary w-full py-2.5 text-sm">
                <MapPin size={15} />
                Confirmar — {atual} (px: {preview.px}, py: {preview.py})
              </button>
            ) : coords[atual] ? (
              <div className="flex gap-2">
                <div
                  className="flex-1 py-2.5 text-xs text-center rounded-[10px] font-medium"
                  style={{ background: 'rgba(26,58,42,0.08)', color: 'var(--forest)' }}
                >
                  ✓ Ponto salvo — clique na imagem para ajustar
                </div>
                <button onClick={() => remover(atual)} className="btn-secondary py-2 px-3 text-xs flex-shrink-0">
                  <RotateCcw size={12} /> Apagar
                </button>
              </div>
            ) : (
              <div
                className="py-2.5 text-xs text-center rounded-[10px]"
                style={{ background: 'var(--cream-dark)', color: 'var(--gray)' }}
              >
                ← Clique na orelha acima para posicionar o ponto
              </div>
            )}
          </div>
        </div>

        {/* ── Lista de todos os pontos (navegação rápida) ── */}
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--gray)' }}>
            Todos os 34 pontos — clique para navegar
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ORDEM.map(nome => {
              const ok    = !!coords[nome];
              const ativo = nome === atual;
              return (
                <button
                  key={nome}
                  onClick={() => { setAtual(nome); setPreview(null); }}
                  className="text-[11px] px-2.5 py-1 rounded-full border transition-all"
                  style={{
                    background:   ativo ? 'var(--forest)' : ok ? 'rgba(26,58,42,0.10)' : 'transparent',
                    color:        ativo ? 'white'         : ok ? 'var(--forest)'        : 'var(--gray-light)',
                    borderColor:  ativo ? 'var(--forest)' : ok ? 'rgba(26,58,42,0.28)'  : 'var(--border-card)',
                    fontWeight:   ativo ? 600 : 400,
                  }}
                >
                  {ok ? '✓ ' : ''}{nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Código gerado ── */}
        {calibrados.length > 0 && (
          <div className="card p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>
                  Arquivo gerado — {calibrados.length}/{total} pontos
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--gray-light)' }}>
                  Cole em{' '}
                  <code style={{ color: 'var(--forest)', fontFamily: 'monospace' }}>
                    src/lib/pontos-auriculares.ts
                  </code>
                </p>
              </div>
              <button onClick={copiar} className="btn-primary text-xs py-1.5 px-3 flex-shrink-0">
                {copiado
                  ? <><Check size={12} /> Copiado!</>
                  : <><Copy size={12} /> Copiar tudo</>
                }
              </button>
            </div>
            <pre
              style={{
                background: '#0f1a14',
                color: '#a8e6be',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: 10,
                lineHeight: 1.6,
                padding: '12px',
                borderRadius: 10,
                overflowX: 'auto',
                maxHeight: 280,
                overflowY: 'auto',
              }}
            >
              {gerarCodigo()}
            </pre>
          </div>
        )}

        {/* ── Instruções de como salvar ── */}
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--gray)' }}>
            Como salvar as coordenadas
          </p>
          <ol className="space-y-3">
            {[
              {
                n: '1',
                titulo: 'Calibre todos os 34 pontos',
                desc: 'Clique em cada ponto na imagem da orelha acima. A mira dourada mostra o px/py em tempo real.',
              },
              {
                n: '2',
                titulo: 'Clique em "Copiar tudo"',
                desc: 'O botão copia o arquivo TypeScript completo, já formatado e com todas as zonas e categorias.',
              },
              {
                n: '3',
                titulo: 'Abra o arquivo no VS Code',
                desc: 'Caminho: src/lib/pontos-auriculares.ts',
              },
              {
                n: '4',
                titulo: 'Selecione tudo e cole',
                desc: 'Use Ctrl+A para selecionar o conteúdo do arquivo, depois Ctrl+V para colar. Salve com Ctrl+S.',
              },
              {
                n: '5',
                titulo: 'Verifique no app',
                desc: 'Os pontos aparecem imediatamente na posição correta em todos os mapas auriculares do app.',
              },
            ].map(s => (
              <li key={s.n} className="flex gap-3 items-start">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'var(--forest)', marginTop: 1 }}
                >
                  {s.n}
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--charcoal)' }}>
                    {s.titulo}
                  </p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--gray)' }}>
                    {s.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
}
