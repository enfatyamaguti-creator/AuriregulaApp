'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, TrendingDown, TrendingUp, Pencil, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import {
  getPacienteById,
  deletePaciente,
  updatePacienteStatus,
} from '@/lib/pacientes-storage';
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

type Modal = 'none' | 'alta' | 'deletar';

export default function PacienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [modal, setModal] = useState<Modal>('none');

  useEffect(() => {
    getPacienteById(id).then(p => {
      if (!p) { router.replace('/pacientes'); return; }
      setPaciente(p);
    });
  }, [id, router]);

  if (!paciente) return null;

  const sessoes = paciente.sessoes ?? [];
  const ultimaSessao = sessoes[sessoes.length - 1];
  const primeiraSessao = sessoes[0];

  async function handleAlta() {
    await updatePacienteStatus(id, 'alta');
    setPaciente(prev => prev ? { ...prev, status: 'alta' } : prev);
    setModal('none');
  }

  async function handleDeletar() {
    await deletePaciente(id);
    router.replace('/pacientes');
  }

  return (
    <div>
      <AppHeader
        titulo={paciente.nome}
        subtitulo={paciente.queixaPrincipal}
        voltar
        voltarHref="/pacientes"
        acoes={
          <Link
            href={`/pacientes/${id}/editar`}
            className="p-2 rounded-[8px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            <Pencil size={16} />
          </Link>
        }
      />

      <div className="px-4 md:px-8 py-4 md:py-6 space-y-4 w-full max-w-4xl mx-auto">

        <div className="card p-4 grid grid-cols-2 gap-3">
          {[
            ['Idade', paciente.idade > 0 ? `${paciente.idade} anos` : '—'],
            ['Sexo', paciente.sexo],
            ['Telefone', paciente.telefone || '—'],
            ['Status', STATUS_LABEL[paciente.status]],
          ].map(([label, val]) => (
            <div key={label as string}>
              <p className="text-xs" style={{ color: 'var(--gray)' }}>{label}</p>
              <p
                className="text-sm font-medium mt-0.5"
                style={{ color: label === 'Status' ? STATUS_COR[paciente.status] : 'var(--charcoal)' }}
              >
                {val}
              </p>
            </div>
          ))}
        </div>

        {sessoes.length >= 2 && primeiraSessao && ultimaSessao && (
          <div
            className="p-4 rounded-[14px] flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(15,110,86,0.08), rgba(26,58,42,0.05))' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(15,110,86,0.15)' }}
            >
              {primeiraSessao.escalaDor >= ultimaSessao.escalaDor
                ? <TrendingDown size={22} style={{ color: '#0f6e56' }} />
                : <TrendingUp size={22} style={{ color: 'var(--rose)' }} />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0f6e56' }}>
                Evolução · {sessoes.length} sessões
              </p>
              <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--charcoal)' }}>
                Dor: {primeiraSessao.escalaDor} → {ultimaSessao.escalaDor}
                {primeiraSessao.escalaDor > ultimaSessao.escalaDor
                  ? ` (↓${primeiraSessao.escalaDor - ultimaSessao.escalaDor} pts)`
                  : primeiraSessao.escalaDor < ultimaSessao.escalaDor
                    ? ` (↑${ultimaSessao.escalaDor - primeiraSessao.escalaDor} pts)`
                    : ' (estável)'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--gray)' }}>
                Sono: {primeiraSessao.qualidadeSono} → {ultimaSessao.qualidadeSono}/10
              </p>
            </div>
          </div>
        )}

        {sessoes.length === 0 && (
          <div
            className="p-4 rounded-[14px] text-center"
            style={{ background: 'rgba(184,151,74,0.07)', border: '1px dashed rgba(184,151,74,0.35)' }}
          >
            <p className="text-sm" style={{ color: 'var(--gray)' }}>Nenhuma sessão registrada ainda</p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>
              Histórico de sessões
            </p>
            {paciente.status !== 'alta' && (
              <Link href={`/pacientes/${id}/nova-sessao`} className="btn-primary text-xs py-1.5 px-3">
                <Plus size={13} />
                Nova sessão
              </Link>
            )}
          </div>

          {sessoes.length > 0 ? (
            <div className="space-y-2">
              {[...sessoes].reverse().map(sessao => (
                <div key={sessao.id} className="card p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--forest)' }}>
                        Sessão {sessao.numeroSessao}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--gray)' }}>
                        {new Date(sessao.dataSessao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--charcoal)' }}>
                    {sessao.protocoloNome}
                  </p>
                  {sessao.queixaDia && (
                    <p className="text-xs mb-2 italic" style={{ color: 'var(--gray)' }}>"{sessao.queixaDia}"</p>
                  )}
                  <div className="flex gap-4">
                    {[
                      { label: 'Dor', valor: sessao.escalaDor },
                      { label: 'Ansiedade', valor: sessao.escalaAnsiedade },
                      { label: 'Sono', valor: sessao.qualidadeSono },
                    ].map(({ label, valor }) => (
                      <div key={label} className="flex flex-col items-center">
                        <span className="text-[10px]" style={{ color: 'var(--gray)' }}>{label}</span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: valor >= 7 ? 'var(--rose)' : valor >= 4 ? 'var(--gold)' : 'var(--forest-light)' }}
                        >
                          {valor}
                        </span>
                      </div>
                    ))}
                  </div>
                  {sessao.observacoes && (
                    <p className="text-xs mt-2 pt-2 border-t" style={{ color: 'var(--gray)', borderColor: 'var(--border-card)' }}>
                      {sessao.observacoes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-2 pt-2">
          {paciente.status !== 'alta' && (
            <button
              onClick={() => setModal('alta')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-sm font-medium transition-all active:scale-[0.98]"
              style={{ backgroundColor: 'rgba(15,110,86,0.08)', color: 'var(--forest)', border: '1px solid rgba(15,110,86,0.2)' }}
            >
              <CheckCircle size={16} />
              Dar alta ao paciente
            </button>
          )}

          <button
            onClick={() => setModal('deletar')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-sm font-medium transition-all active:scale-[0.98]"
            style={{ backgroundColor: 'rgba(139,58,82,0.07)', color: 'var(--rose)', border: '1px solid rgba(139,58,82,0.2)' }}
          >
            <Trash2 size={16} />
            Excluir paciente
          </button>
        </div>

        <div className="pb-6" />
      </div>

      {modal === 'alta' && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setModal('none')}
        >
          <div
            className="w-full max-w-2xl rounded-t-[20px] p-6 space-y-4"
            style={{ backgroundColor: 'white' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={24} style={{ color: 'var(--forest)' }} />
              <div>
                <p className="font-semibold" style={{ color: 'var(--charcoal)' }}>Confirmar alta</p>
                <p className="text-sm" style={{ color: 'var(--gray)' }}>O tratamento de <strong>{paciente.nome}</strong> será encerrado</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModal('none')}
                className="flex-1 py-3 rounded-[12px] text-sm font-medium"
                style={{ backgroundColor: 'var(--cream-dark)', color: 'var(--charcoal)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAlta}
                className="flex-1 py-3 rounded-[12px] text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--forest)' }}
              >
                Confirmar alta
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'deletar' && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setModal('none')}
        >
          <div
            className="w-full max-w-2xl rounded-t-[20px] p-6 space-y-4"
            style={{ backgroundColor: 'white' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} style={{ color: 'var(--rose)' }} />
              <div>
                <p className="font-semibold" style={{ color: 'var(--charcoal)' }}>Excluir paciente</p>
                <p className="text-sm" style={{ color: 'var(--gray)' }}>
                  Todos os dados de <strong>{paciente.nome}</strong> serão removidos permanentemente.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModal('none')}
                className="flex-1 py-3 rounded-[12px] text-sm font-medium"
                style={{ backgroundColor: 'var(--cream-dark)', color: 'var(--charcoal)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletar}
                className="flex-1 py-3 rounded-[12px] text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--rose)' }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
