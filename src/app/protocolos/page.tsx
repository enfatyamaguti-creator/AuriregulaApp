'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import FilterRow from '@/components/Layout/FilterRow';
import SearchInput from '@/components/Layout/SearchInput';
import ProtoCard from '@/components/ProtoCard/ProtoCard';
import { PROTOCOLOS, GRUPOS_PROTOCOLOS, buscarProtocolos, PROTOCOLO_MASTER } from '@/lib/protocolos';

const POR_PAGINA = 8;

export default function ProtocolosPage() {
  const [busca, setBusca]           = useState('');
  const [grupoAtivo, setGrupoAtivo] = useState('todos');
  const [pagina, setPagina]         = useState(1);
  const [favoritos, setFavoritos]   = useState<Set<string>>(new Set());
  const listaRef = useRef<HTMLDivElement>(null);

  const toggleFavorito = useCallback((id: string) => {
    setFavoritos(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const protocolosFiltrados = useMemo(() => {
    let lista = busca ? buscarProtocolos(busca) : PROTOCOLOS;
    if (grupoAtivo !== 'todos') lista = lista.filter(p => p.grupo === grupoAtivo);
    return lista.filter(p => !p.isMaster);
  }, [busca, grupoAtivo]);

  const totalPaginas = Math.max(1, Math.ceil(protocolosFiltrados.length / POR_PAGINA));

  const paginaAtual = useMemo(() => {
    const inicio = (pagina - 1) * POR_PAGINA;
    return protocolosFiltrados.slice(inicio, inicio + POR_PAGINA);
  }, [protocolosFiltrados, pagina]);

  function irParaPagina(n: number) {
    setPagina(n);
    listaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function mudarFiltro(grupo: string) {
    setGrupoAtivo(grupo);
    setPagina(1);
  }

  function mudarBusca(v: string) {
    setBusca(v);
    setPagina(1);
  }

  const mostrarMaster = (grupoAtivo === 'todos' || grupoAtivo === 'regulacao') && !busca && pagina === 1;

  return (
    <div>
      <AppHeader
        titulo="Protocolos Clínicos"
        subtitulo={`${PROTOCOLOS.length - 1} protocolos disponíveis`}
      />

      <div className="px-4 md:px-8 py-4 md:py-6 space-y-4 w-full max-w-4xl mx-auto">
        <SearchInput
          value={busca}
          onChange={mudarBusca}
          placeholder="Buscar por nome, queixa ou ponto..."
        />

        <FilterRow
          itens={GRUPOS_PROTOCOLOS}
          ativo={grupoAtivo}
          onChange={mudarFiltro}
        />

        {/* Protocolo Master em destaque — sempre visível */}
        {mostrarMaster && (
          <ProtoCard
            protocolo={PROTOCOLO_MASTER}
            expandidoPorPadrao={false}
            onFavoritar={toggleFavorito}
            favoritado={favoritos.has(PROTOCOLO_MASTER.id)}
          />
        )}

        {/* Lista paginada */}
        <div ref={listaRef} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {protocolosFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="font-display text-lg" style={{ color: 'var(--gray)' }}>Nenhum protocolo encontrado</p>
              <p className="text-sm mt-1" style={{ color: 'var(--gray-light)' }}>Tente outro termo ou categoria</p>
            </div>
          ) : (
            paginaAtual.map(protocolo => (
              <ProtoCard
                key={protocolo.id}
                protocolo={protocolo}
                onFavoritar={toggleFavorito}
                favoritado={favoritos.has(protocolo.id)}
              />
            ))
          )}
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between pt-1 pb-2">
            <button
              onClick={() => irParaPagina(Math.max(1, pagina - 1))}
              disabled={pagina === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-[10px] text-sm font-medium transition-all active:scale-95 disabled:opacity-30"
              style={{ backgroundColor: 'white', color: 'var(--forest)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-card)' }}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <span className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
              {pagina} / {totalPaginas}
            </span>

            <button
              onClick={() => irParaPagina(Math.min(totalPaginas, pagina + 1))}
              disabled={pagina === totalPaginas}
              className="flex items-center gap-1 px-3 py-2 rounded-[10px] text-sm font-medium transition-all active:scale-95 disabled:opacity-30"
              style={{ backgroundColor: 'white', color: 'var(--forest)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-card)' }}
            >
              Próxima
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        <p className="text-xs text-center pb-4" style={{ color: 'var(--gray-light)' }}>
          {protocolosFiltrados.length} protocolo(s) · página {pagina} de {totalPaginas}
        </p>
      </div>
    </div>
  );
}
