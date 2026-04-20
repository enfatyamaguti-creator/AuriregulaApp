import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import { getCapituloPorNumero, TODOS_CAPITULOS } from '@/lib/capitulos';

interface Props { params: Promise<{ numero: string }> }

export default async function CapituloPage({ params }: Props) {
  const { numero: numStr } = await params;
  const numero = parseInt(numStr, 10);
  const capitulo = getCapituloPorNumero(numero);
  if (!capitulo) notFound();

  const totalCapitulos = TODOS_CAPITULOS.length;
  const anterior = numero > 1 ? numero - 1 : null;
  const proximo = numero < totalCapitulos ? numero + 1 : null;

  return (
    <div>
      <AppHeader
        titulo={`Capítulo ${numero}`}
        subtitulo={capitulo.titulo}
        voltar
        voltarHref="/ebook"
      />

      <div className="px-4 py-5">
        {/* Subtítulo */}
        {capitulo.subtitulo && (
          <p className="text-base mb-5" style={{ color: 'var(--gray)', fontFamily: 'var(--font-cormorant)' }}>
            {capitulo.subtitulo}
          </p>
        )}

        {/* Conteúdo em modo leitura */}
        <div className="modo-leitura">
          {capitulo.conteudo.split('\n').map((linha, i) => {
            if (linha.startsWith('## '))
              return <h2 key={i} className="font-display text-2xl font-semibold mt-6 mb-3" style={{ color: 'var(--forest)' }}>{linha.slice(3)}</h2>;
            if (linha.startsWith('### '))
              return <h3 key={i} className="font-display text-xl font-semibold mt-5 mb-2" style={{ color: 'var(--forest-mid)' }}>{linha.slice(4)}</h3>;
            if (linha.startsWith('**') && linha.endsWith('**'))
              return <p key={i} className="font-semibold mt-3 mb-1" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-dm-sans)' }}>{linha.slice(2, -2)}</p>;
            if (linha.startsWith('- '))
              return <li key={i} className="ml-4 mb-1" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-dm-sans)', fontSize: '0.95rem' }}>{linha.slice(2)}</li>;
            if (linha.trim() === '')
              return <div key={i} className="h-2" />;
            return <p key={i} className="mb-3 leading-relaxed" style={{ color: 'var(--charcoal)' }}>{linha}</p>;
          })}
        </div>

        {/* Navegação entre capítulos */}
        <div className="flex gap-3 mt-8 pt-5 border-t" style={{ borderColor: 'var(--border-card)' }}>
          {anterior ? (
            <Link href={`/ebook/${anterior}`} className="btn-secondary flex-1">
              <ChevronLeft size={16} />
              Cap. {anterior}
            </Link>
          ) : <div className="flex-1" />}

          {proximo && (
            <Link href={`/ebook/${proximo}`} className="btn-primary flex-1 justify-center">
              Cap. {proximo}
              <ChevronRight size={16} />
            </Link>
          )}
        </div>

        <div className="pb-6" />
      </div>
    </div>
  );
}
