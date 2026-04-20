'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Calendar, Clock, User, CheckCircle, XCircle, Trash2, ChevronDown, X, Stethoscope } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import { PROTOCOLOS } from '@/lib/protocolos';
import {
  getAgendamentos,
  addAgendamento,
  updateStatus,
  deleteAgendamento,
  type Agendamento,
  type StatusAgendamento,
} from '@/lib/agendamento-storage';

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-');
  const d = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

function isHoje(data: string): boolean {
  return data === hoje();
}

function isAmanha(data: string): boolean {
  const am = new Date();
  am.setDate(am.getDate() + 1);
  return data === am.toISOString().slice(0, 10);
}

function labelData(data: string): string {
  if (isHoje(data)) return 'Hoje';
  if (isAmanha(data)) return 'Amanhã';
  return formatarData(data);
}

const STATUS_CONFIG: Record<StatusAgendamento, { label: string; cor: string; bg: string }> = {
  agendado:  { label: 'Agendado',  cor: '#1a3a2a', bg: 'rgba(26,58,42,0.10)'  },
  realizado: { label: 'Realizado', cor: '#0f6e56', bg: 'rgba(15,110,86,0.10)' },
  cancelado: { label: 'Cancelado', cor: '#9b3a3a', bg: 'rgba(155,58,58,0.10)' },
};

function CardAgendamento({
  ag,
  onStatus,
  onDelete,
}: {
  ag: Agendamento;
  onStatus: (id: string, s: StatusAgendamento) => void;
  onDelete: (id: string) => void;
}) {
  const [menu, setMenu] = useState(false);
  const cfg = STATUS_CONFIG[ag.status];

  return (
    <div
      className="card p-4 space-y-2.5 relative"
      style={{ borderLeft: `3px solid ${cfg.cor}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Clock size={13} style={{ color: 'var(--forest)', flexShrink: 0 }} />
            <span className="text-sm font-bold" style={{ color: 'var(--charcoal)' }}>{ag.hora}</span>
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ color: cfg.cor, backgroundColor: cfg.bg }}
            >
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={13} style={{ color: 'var(--gray)', flexShrink: 0 }} />
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--charcoal)' }}>
              {ag.pacienteNome}
            </p>
          </div>
          {ag.protocolo && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Stethoscope size={12} style={{ color: 'var(--gray)', flexShrink: 0 }} />
              <p className="text-xs truncate" style={{ color: 'var(--gray)' }}>{ag.protocolo}</p>
            </div>
          )}
          {ag.observacoes && (
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--gray-light)' }}>
              {ag.observacoes}
            </p>
          )}
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenu(v => !v)}
            className="p-1.5 rounded-[8px] transition-all active:scale-90"
            style={{ backgroundColor: 'rgba(26,58,42,0.06)' }}
          >
            <ChevronDown size={16} style={{ color: 'var(--gray)' }} />
          </button>
          {menu && (
            <div
              className="absolute right-0 top-9 z-50 rounded-[12px] py-1 min-w-[160px]"
              style={{ backgroundColor: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', border: '1px solid var(--border-card)' }}
            >
              {ag.status === 'agendado' && (
                <>
                  <button
                    onClick={() => { onStatus(ag.id, 'realizado'); setMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-all active:bg-gray-50"
                    style={{ color: '#0f6e56' }}
                  >
                    <CheckCircle size={14} /> Marcar realizado
                  </button>
                  <button
                    onClick={() => { onStatus(ag.id, 'cancelado'); setMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-all active:bg-gray-50"
                    style={{ color: '#9b3a3a' }}
                  >
                    <XCircle size={14} /> Cancelar
                  </button>
                  <div className="h-px mx-2" style={{ backgroundColor: 'var(--border-card)' }} />
                </>
              )}
              <button
                onClick={() => { onDelete(ag.id); setMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-all active:bg-gray-50"
                style={{ color: '#9b3a3a' }}
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalNovoAgendamento({
  onClose,
  onSalvar,
}: {
  onClose: () => void;
  onSalvar: (dados: { pacienteNome: string; data: string; hora: string; protocolo?: string; observacoes?: string }) => void;
}) {
  const [pacienteNome, setPacienteNome] = useState('');
  const [data, setData] = useState(hoje());
  const [hora, setHora] = useState('08:00');
  const [protocolo, setProtocolo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});

  const nomes = PROTOCOLOS.map(p => p.nome);

  function validar(): boolean {
    const e: Record<string, string> = {};
    if (!pacienteNome.trim()) e.pacienteNome = 'Informe o nome do paciente';
    if (!data) e.data = 'Informe a data';
    if (!hora) e.hora = 'Informe o horário';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validar()) return;
    onSalvar({ pacienteNome: pacienteNome.trim(), data, hora, protocolo: protocolo || undefined, observacoes: observacoes.trim() || undefined });
    onClose();
  }

  const inputStyle = (campo: string) => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: `1.5px solid ${erros[campo] ? '#c0392b' : 'var(--border-card)'}`,
    fontSize: 14,
    color: 'var(--charcoal)',
    backgroundColor: 'white',
    outline: 'none',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full rounded-t-[24px] overflow-y-auto"
        style={{ backgroundColor: 'var(--cream)', maxHeight: '92vh' }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--border-card)' }} />
        </div>

        <div className="flex items-center justify-between px-5 py-3 gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-all active:scale-90 flex-shrink-0"
            style={{ backgroundColor: 'rgba(26,58,42,0.08)' }}
          >
            <X size={18} style={{ color: 'var(--charcoal)' }} />
          </button>
          <h2 className="font-display text-lg font-bold flex-1 text-center" style={{ color: 'var(--charcoal)' }}>
            Novo Agendamento
          </h2>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-[10px] text-xs font-bold transition-all active:scale-95 flex-shrink-0"
            style={{ backgroundColor: 'var(--forest)', color: 'white' }}
          >
            Salvar
          </button>
        </div>

        <div className="px-5 pb-8 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--gray)' }}>
              Paciente *
            </label>
            <input
              type="text"
              placeholder="Nome do paciente"
              value={pacienteNome}
              onChange={e => setPacienteNome(e.target.value)}
              style={inputStyle('pacienteNome')}
            />
            {erros.pacienteNome && <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{erros.pacienteNome}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--gray)' }}>
                Data *
              </label>
              <input
                type="date"
                value={data}
                min={hoje()}
                onChange={e => setData(e.target.value)}
                style={inputStyle('data')}
              />
              {erros.data && <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{erros.data}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--gray)' }}>
                Horário *
              </label>
              <input
                type="time"
                value={hora}
                onChange={e => setHora(e.target.value)}
                style={inputStyle('hora')}
              />
              {erros.hora && <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{erros.hora}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--gray)' }}>
              Protocolo (opcional)
            </label>
            <select
              value={protocolo}
              onChange={e => setProtocolo(e.target.value)}
              style={{ ...inputStyle(''), appearance: 'none' }}
            >
              <option value="">Selecionar protocolo...</option>
              {nomes.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--gray)' }}>
              Observações (opcional)
            </label>
            <textarea
              placeholder="Ex: trazer exames, retorno pós-alta..."
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              rows={3}
              style={{ ...inputStyle(''), resize: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgendamentoPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtro, setFiltro] = useState<'proximos' | 'todos' | 'realizados'>('proximos');

  const carregar = useCallback(async () => {
    const lista = await getAgendamentos();
    setAgendamentos(lista);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function handleSalvar(dados: Parameters<typeof addAgendamento>[0]) {
    await addAgendamento(dados);
    await carregar();
  }

  async function handleStatus(id: string, status: StatusAgendamento) {
    await updateStatus(id, status);
    await carregar();
  }

  async function handleDelete(id: string) {
    await deleteAgendamento(id);
    await carregar();
  }

  const hj = hoje();

  const filtrados = agendamentos.filter(a => {
    if (filtro === 'proximos') return a.data >= hj && a.status === 'agendado';
    if (filtro === 'realizados') return a.status === 'realizado';
    return true;
  });

  const grupos = filtrados.reduce<Record<string, Agendamento[]>>((acc, ag) => {
    (acc[ag.data] = acc[ag.data] || []).push(ag);
    return acc;
  }, {});
  const datas = Object.keys(grupos).sort();

  const totalHoje = agendamentos.filter(a => a.data === hj && a.status === 'agendado').length;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--cream)' }}>
      <AppHeader titulo="Agenda" subtitulo="Gerenciar agendamentos" voltarHref="/home" />

      <div className="px-4 md:px-8 py-5 md:py-6 space-y-4 w-full max-w-4xl mx-auto">

        <div
          className="rounded-[16px] p-4 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #1a3a2a, #2d5a42)', boxShadow: '0 4px 20px rgba(26,58,42,0.20)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <Calendar size={22} color="white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Agendamentos hoje
            </p>
            <p className="font-display text-3xl font-bold text-white leading-none">{totalHoje}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.60)' }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </p>
          </div>
          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-bold transition-all active:scale-95"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            <Plus size={14} /> Novo
          </button>
        </div>

        <div className="flex gap-2">
          {([
            { key: 'proximos', label: 'Próximos' },
            { key: 'todos', label: 'Todos' },
            { key: 'realizados', label: 'Realizados' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                filtro === key
                  ? { backgroundColor: 'var(--forest)', color: 'white' }
                  : { backgroundColor: 'white', color: 'var(--gray)', border: '1.5px solid var(--border-card)' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {datas.length === 0 ? (
          <div className="card p-8 text-center space-y-3">
            <Calendar size={36} style={{ color: 'var(--gray-light)', margin: '0 auto' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>Nenhum agendamento encontrado</p>
            <p className="text-xs" style={{ color: 'var(--gray-light)' }}>Toque em "+ Novo" para agendar uma sessão</p>
            <button
              onClick={() => setModalAberto(true)}
              className="mt-2 px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all active:scale-95"
              style={{ backgroundColor: 'var(--forest)', color: 'white' }}
            >
              Novo Agendamento
            </button>
          </div>
        ) : (
          datas.map(data => (
            <div key={data}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: isHoje(data) ? 'var(--forest)' : 'var(--gray)' }}
                >
                  {labelData(data)}
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-card)' }} />
                <span className="text-[10px] font-medium" style={{ color: 'var(--gray-light)' }}>
                  {grupos[data].length} sessão{grupos[data].length !== 1 ? 'ões' : ''}
                </span>
              </div>
              <div className="space-y-2">
                {grupos[data].map(ag => (
                  <CardAgendamento
                    key={ag.id}
                    ag={ag}
                    onStatus={handleStatus}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setModalAberto(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90"
        style={{ backgroundColor: 'var(--forest)', boxShadow: '0 4px 20px rgba(26,58,42,0.35)' }}
      >
        <Plus size={24} color="white" />
      </button>

      {modalAberto && (
        <ModalNovoAgendamento
          onClose={() => setModalAberto(false)}
          onSalvar={handleSalvar}
        />
      )}
    </div>
  );
}
