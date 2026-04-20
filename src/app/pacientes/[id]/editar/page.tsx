'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import { getPacienteById, savePaciente } from '@/lib/pacientes-storage';
import type { Paciente } from '@/types';

export default function EditarPacientePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState<'Feminino' | 'Masculino' | 'Outro'>('Feminino');
  const [telefone, setTelefone] = useState('');
  const [queixaPrincipal, setQueixaPrincipal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    getPacienteById(id).then(p => {
      if (!p) { router.replace('/pacientes'); return; }
      setPaciente(p);
      setNome(p.nome);
      setIdade(p.idade > 0 ? String(p.idade) : '');
      setSexo(p.sexo);
      setTelefone(p.telefone || '');
      setQueixaPrincipal(p.queixaPrincipal);
    });
  }, [id, router]);

  function validar(): boolean {
    const e: Record<string, string> = {};
    if (!nome.trim()) e.nome = 'Nome obrigatório';
    if (!queixaPrincipal.trim()) e.queixaPrincipal = 'Queixa principal obrigatória';
    if (idade && (isNaN(Number(idade)) || Number(idade) < 0 || Number(idade) > 120)) e.idade = 'Idade inválida';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function salvar() {
    if (!paciente || !validar()) return;
    setSalvando(true);
    await savePaciente({
      ...paciente,
      nome: nome.trim(),
      idade: Number(idade) || 0,
      sexo,
      telefone: telefone.trim(),
      queixaPrincipal: queixaPrincipal.trim(),
    });
    router.replace(`/pacientes/${id}`);
  }

  if (!paciente) return null;

  return (
    <div>
      <AppHeader titulo="Editar Paciente" subtitulo={paciente.nome} voltar voltarHref={`/pacientes/${id}`} />

      <div className="px-4 md:px-8 py-5 md:py-6 space-y-5 w-full max-w-4xl mx-auto">

        <div className="rounded-[14px] p-4 space-y-4" style={{ backgroundColor: 'white', boxShadow: 'var(--shadow)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>
            Dados pessoais
          </p>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
              Nome completo <span style={{ color: 'var(--rose)' }}>*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => { setNome(e.target.value); setErros(p => ({ ...p, nome: '' })); }}
              className={`input ${erros.nome ? 'border-red-400' : ''}`}
            />
            {erros.nome && <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>{erros.nome}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>Idade</label>
              <input
                type="number"
                value={idade}
                onChange={e => { setIdade(e.target.value); setErros(p => ({ ...p, idade: '' })); }}
                placeholder="Anos"
                min={0}
                max={120}
                className={`input ${erros.idade ? 'border-red-400' : ''}`}
              />
              {erros.idade && <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>{erros.idade}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>Sexo</label>
              <select value={sexo} onChange={e => setSexo(e.target.value as typeof sexo)} className="input">
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>Telefone / WhatsApp</label>
            <input
              type="tel"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="input"
            />
          </div>
        </div>

        <div className="rounded-[14px] p-4 space-y-4" style={{ backgroundColor: 'white', boxShadow: 'var(--shadow)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>
            Dados clínicos
          </p>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
              Queixa principal <span style={{ color: 'var(--rose)' }}>*</span>
            </label>
            <textarea
              value={queixaPrincipal}
              onChange={e => { setQueixaPrincipal(e.target.value); setErros(p => ({ ...p, queixaPrincipal: '' })); }}
              rows={2}
              className={`input resize-none ${erros.queixaPrincipal ? 'border-red-400' : ''}`}
            />
            {erros.queixaPrincipal && <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>{erros.queixaPrincipal}</p>}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
              Histórico e observações
            </label>
            <textarea
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              placeholder="Medicamentos, condições associadas..."
              rows={3}
              className="input resize-none"
            />
          </div>
        </div>

        <button
          onClick={salvar}
          disabled={salvando}
          className="btn-primary w-full justify-center py-3.5"
          style={{ opacity: salvando ? 0.7 : 1 }}
        >
          <Save size={17} />
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </button>

        <div className="pb-6" />
      </div>
    </div>
  );
}
