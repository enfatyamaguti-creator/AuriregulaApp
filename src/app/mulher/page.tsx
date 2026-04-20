'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import ProtoCard from '@/components/ProtoCard/ProtoCard';
import { PROTOCOLOS } from '@/lib/protocolos';

const SUBCATEGORIA_MULHER = [
  { id: 'todos',       label: 'Todos',              slugs: [] },
  { id: 'ciclo',       label: 'Ciclo e TPM',        slugs: ['tpm', 'tpm-dor', 'reg-neuroendocrina'] },
  { id: 'menopausa',   label: 'Menopausa',          slugs: ['menopausa', 'mulher-40-vitalidade', 'mulher-exaustao', 'insonia-manutencao'] },
  { id: 'emocional',   label: 'Emocional',          slugs: ['ansiedade-cronica', 'depressao', 'estresse'] },
  { id: 'sono',        label: 'Sono',               slugs: ['insonia', 'insonia-manutencao'] },
];

const protocolosMulher = PROTOCOLOS.filter(p =>
  p.grupo === 'mulher' || p.populacao === 'mulher'
);

export default function MulherPage() {
  const [subcategoria, setSubcategoria] = useState('todos');
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());

  function toggleFavorito(id: string) {
    setFavoritos(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const ativo = SUBCATEGORIA_MULHER.find(s => s.id === subcategoria);
  const lista = subcategoria === 'todos'
    ? protocolosMulher
    : protocolosMulher.filter(p => ativo?.slugs.includes(p.slug));

  return (
    <div>
      <AppHeader
        titulo="Saúde da Mulher 40+"
        subtitulo="Protocolos para saúde feminina integrativa"
        variante="rose"
      />

      {/* Banner */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="p-4 rounded-[14px] flex items-start gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(139,58,82,0.10), rgba(196,97,122,0.06))', border: '1px solid rgba(139,58,82,0.15)' }}
        >
          <Heart size={20} style={{ color: 'var(--rose)', flexShrink: 0, marginTop: 1 }} fill="rgba(139,58,82,0.2)" />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--rose)' }}>Módulo Saúde da Mulher</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--gray)' }}>
              Protocolos específicos para o ciclo hormonal feminino, transição da menopausa, TPM, fertilidade e vitalidade feminina integrativa.
            </p>
          </div>
        </div>
      </div>

      {/* Filtros por subcategoria */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {SUBCATEGORIA_MULHER.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSubcategoria(id)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border"
              style={{
                backgroundColor: subcategoria === id ? 'var(--rose)' : 'var(--cream-dark)',
                color: subcategoria === id ? 'white' : 'var(--charcoal)',
                borderColor: subcategoria === id ? 'var(--rose)' : 'transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 pb-5 space-y-3">
        {lista.length === 0 ? (
          <div className="text-center py-10">
            <p className="font-display text-lg" style={{ color: 'var(--gray)' }}>Nenhum protocolo nesta categoria</p>
          </div>
        ) : (
          lista.map(protocolo => (
            <ProtoCard
              key={protocolo.id}
              protocolo={protocolo}
              onFavoritar={toggleFavorito}
              favoritado={favoritos.has(protocolo.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
