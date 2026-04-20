import Link from 'next/link';
import { BookOpen, Lock } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import { TODOS_CAPITULOS, CAPITULOS } from '@/lib/capitulos';

const CAPITULOS_DISPONIVEIS = new Set(CAPITULOS.map(c => c.numero));

export default function EbookPage() {
  return (
    <div>
      <AppHeader
        titulo="Ebook — Auriculoterapia Clínica"
        subtitulo="16 capítulos · Raciocínio neurofisiológico"
      />

      <div className="px-4 py-4 space-y-3">
        <div className="card p-4">
          <p className="font-display text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>
            Auriculoterapia Clínica Baseada no Raciocínio Neurofisiológico
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--gray)' }}>Método R.E.G.U.L.A.® — Conteúdo completo em 16 capítulos</p>
        </div>

        <div className="space-y-2">
          {TODOS_CAPITULOS.map(({ num, titulo }) => {
            const disponivel = CAPITULOS_DISPONIVEIS.has(num);
            return (
              <div key={num}>
                {disponivel ? (
                  <Link href={`/ebook/${num}`} className="block">
                    <div
                      className="flex items-center gap-3 p-3.5 rounded-[12px] transition-all active:scale-[0.98]"
                      style={{ backgroundColor: 'white', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: 'var(--forest)', color: 'white' }}
                      >
                        {num}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--charcoal)' }}>{titulo}</p>
                      </div>
                      <BookOpen size={15} style={{ color: 'var(--forest)', flexShrink: 0 }} />
                    </div>
                  </Link>
                ) : (
                  <div
                    className="flex items-center gap-3 p-3.5 rounded-[12px] opacity-50"
                    style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--border-card)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: 'var(--gray-light)', color: 'white' }}
                    >
                      {num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--gray)' }}>{titulo}</p>
                    </div>
                    <Lock size={14} style={{ color: 'var(--gray-light)', flexShrink: 0 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
