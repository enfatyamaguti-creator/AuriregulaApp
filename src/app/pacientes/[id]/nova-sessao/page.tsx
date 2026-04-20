'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import { PROTOCOLOS } from '@/lib/protocolos';
import { addSessao, getPacienteById } from '@/lib/pacientes-storage';
import type { Paciente } from '@/types';

function EscalaSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>{label}</label>
        <span
          className="text-lg font-bold font-display"
          style={{ color: value >= 7 ? 'var(--rose)' : value >= 4 ? 'var(--gold)' : 'var(--forest-light)' }}
        >
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full cursor-pointer appearance-none"
        style={{ background: `linear-gradient(to right, var(--forest) ${value * 10}%, var(--cream-dark) ${value * 10}%)` }}
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-[10px]" style={{ color: 'var(--gray-light)' }}>0</span>
        <span className="text-[10px]" style={{ color: 'var(--gray-light)' }}>10</span>
      </div>
    </div>
  );
}

export default function NovaSessaoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [queixa, setQueixa] = useState('');
  const [protocoloId, setProtocoloId] = useState('');
  const [dor, setDor] = useState(5);
  const [ansiedade, setAnsiedade] = useState(5);
  const [sono, setSono] = useState(5);
  const [observacoes, setObservacoes] = useState('');
  const [ajustes, setAjustes] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    getPacienteById(id).then(p => {
      if (!p) { router.replace('/pacientes'); return; }
      setPaciente(p);
    });
  }, [id, router]);

  async function salvar() {
    if (!protocoloId) { setErro('Selecione um protocolo antes de salvar.'); return; }
    setSalvando(true);
    setErro('');

    const protocolo = PROTOCOLOS.find(p => p.id === protocoloId);
    const sessoes = paciente?.sessoes ?? [];

    await addSessao(id, {
      dataSessao: new Date().toISOString().split('T')[0],
      numeroSessao: sessoes.length + 1,
      queixaDia: queixa,
      protocoloId,
      protocoloNome: protocolo?.nome ?? protocoloId,
      pontosUsados: protocolo?.pontos ?? [],
      escalaDor: dor,
      escalaAnsiedade: ansiedade,
      qualidadeSono: sono,
      observacoes,
      ajustes,
    });

    router.replace(`/pacientes/${id}`);
  }

  if (!paciente) return null;

  return (
    <div>
      <AppHeader titulo="Nova Sessão" subtitulo={paciente.nome} voltar voltarHref={`/pacientes/${id}`} />

      <div className="px-4 md:px-8 py-5 md:py-6 space-y-5 w-full max-w-4xl mx-auto">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--gray)' }}>
            Queixa do dia
          </label>
          <textarea
            value={queixa}
            onChange={e => setQueixa(e.target.value)}
            placeholder="Como o paciente chegou hoje?"
            rows={3}
            className="input resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--gray)' }}>
            Protocolo aplicado <span style={{ color: 'var(--rose)' }}>*</span>
          </label>
          <select
            value={protocoloId}
            onChange={e => { setProtocoloId(e.target.value); setErro(''); }}
            className={`input ${erro ? 'border-red-400' : ''}`}
          >
            <option value="">Selecionar protocolo...</option>
            {PROTOCOLOS.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          {erro && <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>{erro}</p>}
        </div>

        <div className="card p-4 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>
            Escalas (início da sessão)
          </p>
          <EscalaSlider label="Intensidade da dor" value={dor} onChange={setDor} />
          <EscalaSlider label="Nível de ansiedade" value={ansiedade} onChange={setAnsiedade} />
          <EscalaSlider label="Qualidade do sono" value={sono} onChange={setSono} />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--gray)' }}>
            Observações clínicas
          </label>
          <textarea
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
            placeholder="Evolução, reações, intercorrências..."
            rows={3}
            className="input resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--gray)' }}>
            Ajustes para próxima sessão
          </label>
          <textarea
            value={ajustes}
            onChange={e => setAjustes(e.target.value)}
            placeholder="Pontos a adicionar, retirar, adaptar..."
            rows={2}
            className="input resize-none"
          />
        </div>

        <button
          onClick={salvar}
          disabled={salvando}
          className="btn-primary w-full justify-center py-3"
          style={{ opacity: salvando ? 0.7 : 1 }}
        >
          <Save size={16} />
          {salvando ? 'Salvando...' : 'Salvar sessão'}
        </button>

        <div className="pb-4" />
      </div>
    </div>
  );
}
