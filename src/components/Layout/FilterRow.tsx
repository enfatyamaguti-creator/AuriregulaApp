'use client';

import { useRef, useState, useEffect } from 'react';

interface FiltroItem {
  id: string;
  label: string;
  cor?: string;
}

interface Props {
  itens: FiltroItem[];
  ativo: string;
  onChange: (id: string) => void;
}

export default function FilterRow({ itens, ativo, onChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);

  function checkFades() {
    const el = scrollRef.current;
    if (!el) return;
    setFadeLeft(el.scrollLeft > 4);
    setFadeRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    checkFades();
    const el = scrollRef.current;
    el?.addEventListener('scroll', checkFades, { passive: true });
    const ro = new ResizeObserver(checkFades);
    if (el) ro.observe(el);
    return () => { el?.removeEventListener('scroll', checkFades); ro.disconnect(); };
  }, [itens]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Gradiente esquerda */}
      {fadeLeft && (
        <div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, zIndex: 2,
            background: 'linear-gradient(to right, var(--cream), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Scroll horizontal */}
      <div
        ref={scrollRef}
        className="flex gap-2 pb-2"
        style={{
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(26,58,42,0.25) transparent',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {itens.map(({ id, label }) => {
          const isAtivo = ativo === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap"
              style={{
                backgroundColor: isAtivo ? 'var(--forest)' : 'var(--cream-dark)',
                color: isAtivo ? 'white' : 'var(--charcoal)',
                border: isAtivo ? '1.5px solid var(--forest)' : '1.5px solid transparent',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Gradiente direita */}
      {fadeRight && (
        <div
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, zIndex: 2,
            background: 'linear-gradient(to left, var(--cream), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
