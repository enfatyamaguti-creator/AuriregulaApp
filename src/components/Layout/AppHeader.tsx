'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface Props {
  titulo: string;
  subtitulo?: string;
  variante?: 'forest' | 'rose' | 'amber' | 'white' | 'teal';
  voltar?: boolean;
  voltarHref?: string;
  acoes?: React.ReactNode;
}

const VARIANTES = {
  forest: { bg: 'var(--forest)',  texto: 'white',              subtexto: 'rgba(255,255,255,0.7)' },
  rose:   { bg: 'var(--rose)',    texto: 'white',              subtexto: 'rgba(255,255,255,0.7)' },
  amber:  { bg: 'var(--gold)',    texto: 'white',              subtexto: 'rgba(255,255,255,0.7)' },
  white:  { bg: 'white',         texto: 'var(--charcoal)',    subtexto: 'var(--gray)'           },
  teal:   { bg: '#185FA5',       texto: 'white',              subtexto: 'rgba(255,255,255,0.7)' },
};

export default function AppHeader({ titulo, subtitulo, variante = 'forest', voltar, voltarHref, acoes }: Props) {
  const router = useRouter();
  const { bg, texto, subtexto } = VARIANTES[variante];

  const btnStyle = { color: texto, backgroundColor: 'rgba(255,255,255,0.12)' };

  const BackButton = voltarHref ? (
    <Link
      href={voltarHref}
      className="p-1.5 rounded-[8px] transition-all active:scale-90 flex items-center justify-center flex-shrink-0"
      style={btnStyle}
    >
      <ArrowLeft size={20} />
    </Link>
  ) : (
    <button
      onClick={() => router.back()}
      className="p-1.5 rounded-[8px] transition-all active:scale-90 flex-shrink-0"
      style={btnStyle}
    >
      <ArrowLeft size={20} />
    </button>
  );

  return (
    <header
      className="sticky top-0 z-40 px-4 md:px-6 py-3 md:py-4"
      style={{ backgroundColor: bg, boxShadow: '0 1px 8px rgba(0,0,0,0.12)' }}
    >
      <div className="flex items-center gap-3 max-w-5xl">
        {voltar && BackButton}

        <div className="flex-1 min-w-0">
          <h1
            className="font-display font-semibold text-xl md:text-2xl leading-tight truncate"
            style={{ color: texto }}
          >
            {titulo}
          </h1>
          {subtitulo && (
            <p className="text-xs md:text-sm mt-0.5 leading-tight truncate" style={{ color: subtexto }}>
              {subtitulo}
            </p>
          )}
        </div>

        {acoes && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {acoes}
          </div>
        )}
      </div>
    </header>
  );
}
