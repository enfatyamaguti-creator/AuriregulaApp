'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, User } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import { getPacientes } from '@/lib/pacientes-storage';
import type { Paciente } from '@/types';

const STATUS_LABEL: Record<string, string> = {
  ativo: 'Em tratamento',
  alta: 'Alta',
  pausado: 'Pausado',
  manutencao: 'Manutenção',
};
const STATUS_COR: Record<string, string> = {
  ativo: '#0f6e56',
  alta: '#1a3a2a',
  pausado: '#6b6b67',
  manutencao: '#b8974a',
};

export default function PacientesPage() {
  const [busca, setBusca] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getPacientes().then(lista => {
      setPacientes(lista);
      setCarregando(false);
    });
  }, []);

  const filtrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.queixaPrincipal.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <AppHeader
        titulo="Pacientes"
        subtitulo={`${pacientes.length} paciente${pacientes.length !== 1 ? 's' : ''}`}
        acoes={
          <Link
            href="/pacientes/novo"
            className="p-2 rounded-[8px] text-white"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Plus size={18} />
          </Link>
        }
      />

      <div className="px-4 md:px-8 py-4 md:py-6 space-y-4 w-full max-w-4xl mx-auto">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--gray)' }} />
          <input
            type="search"
            placeholder="Buscar paciente..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="input pl-9"
          />
        </div>

        {carregando ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: 'var(--gray)' }}>Carregando...</p>
          </div>
        ) : (
          <>
            <div className="space-y-2.5">
              {filtrados.map(p => (
                <Link key={p.id} href={`/pacientes/${p.id}`} className="block">
                  <div className="card p-4 flex items-center gap-3 active:scale-[0.98] transition-all">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(26,58,42,0.08)' }}
                    >
                      <User size={18} style={{ color: 'var(--forest)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate" style={{ color: 'var(--charcoal)' }}>{p.nome}</p>
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `${STATUS_COR[p.status]}15`, color: STATUS_COR[p.status] }}
                        >
                          {STATUS_LABEL[p.status]}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--gray)' }}>{p.queixaPrincipal}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--gray-light)' }}>
                        {p.idade > 0 ? `${p.idade} anos · ` : ''}{p.sessoes?.length ?? 0} sessão(ões)
                      </p>
                    </div>
                    <span style={{ color: 'var(--gray-light)' }}>›</span>
                  </div>
                </Link>
              ))}
            </div>

            {filtrados.length === 0 && (
              <div className="text-center py-12">
                <p className="font-display text-lg" style={{ color: 'var(--gray)' }}>
                  {busca ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                </p>
              </div>
            )}
          </>
        )}

        <Link
          href="/pacientes/novo"
          className="flex items-center justify-center gap-2 p-4 rounded-[14px] border-2 border-dashed text-sm font-medium transition-colors"
          style={{ borderColor: 'rgba(26,58,42,0.20)', color: 'var(--forest)' }}
        >
          <Plus size={16} />
          Novo paciente
        </Link>

        <div className="pb-4" />
      </div>
    </div>
  );
}
