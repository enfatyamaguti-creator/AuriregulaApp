'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, User } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import { savePaciente, generateId } from '@/lib/pacientes-storage';

interface FormData {
  nome: string;
  idade: string;
  sexo: 'Feminino' | 'Masculino' | 'Outro';
  telefone: string;
  queixaPrincipal: string;
  observacoes: string;
}

const INICIAL: FormData = {
  nome: '',
  idade: '',
  sexo: 'Feminino',
  telefone: '',
  queixaPrincipal: '',
  observacoes: '',
};

export default function NovoPacientePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INICIAL);
  const [erros, setErros] = useState<Partial<FormData>>({});
  const [salvando, setSalvando] = useState(false);

  function set(campo: keyof FormData, valor: string) {
    setForm(prev => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros(prev => ({ ...prev, [campo]: '' }));
  }

  function validar(): boolean {
    const novosErros: Partial<FormData> = {};
    if (!form.nome.trim()) novosErros.nome = 'Nome obrigatório';
    if (!form.queixaPrincipal.trim()) novosErros.queixaPrincipal = 'Queixa principal obrigatória';
    if (form.idade && (isNaN(Number(form.idade)) || Number(form.idade) < 0 || Number(form.idade) > 120)) {
      novosErros.idade = 'Idade inválida';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function salvar() {
    if (!validar()) return;
    setSalvando(true);
    const agora = new Date().toISOString();
    await savePaciente({
      id: generateId(),
      userId: '',
      nome: form.nome.trim(),
      idade: Number(form.idade) || 0,
      sexo: form.sexo,
      telefone: form.telefone.trim(),
      queixaPrincipal: form.queixaPrincipal.trim(),
      status: 'ativo',
      sessoes: [],
      createdAt: agora,
      updatedAt: agora,
    });
    router.push('/pacientes');
  }

  const inputClass = (campo: keyof FormData) =>
    `input ${erros[campo] ? 'border-red-400 focus:border-red-400' : ''}`;

  return (
    <div>
      <AppHeader titulo="Novo Paciente" subtitulo="Preencha os dados do paciente" voltar voltarHref="/pacientes" />

      <div className="px-4 md:px-8 py-5 md:py-6 space-y-5 w-full max-w-4xl mx-auto">

        <div className="flex justify-center pt-1 pb-2">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(26,58,42,0.08)' }}
          >
            <User size={36} style={{ color: 'var(--forest)' }} />
          </div>
        </div>

        <div
          className="rounded-[14px] p-4 space-y-4"
          style={{ backgroundColor: 'white', boxShadow: 'var(--shadow)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>
            Dados pessoais
          </p>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
              Nome completo <span style={{ color: 'var(--rose)' }}>*</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="Nome do paciente"
              className={inputClass('nome')}
              autoFocus
            />
            {erros.nome && <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>{erros.nome}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
                Idade
              </label>
              <input
                type="number"
                value={form.idade}
                onChange={e => set('idade', e.target.value)}
                placeholder="Anos"
                min={0}
                max={120}
                className={inputClass('idade')}
              />
              {erros.idade && <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>{erros.idade}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
                Sexo
              </label>
              <select
                value={form.sexo}
                onChange={e => set('sexo', e.target.value)}
                className="input"
              >
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
              Telefone / WhatsApp
            </label>
            <input
              type="tel"
              value={form.telefone}
              onChange={e => set('telefone', e.target.value)}
              placeholder="(00) 00000-0000"
              className="input"
            />
          </div>
        </div>

        <div
          className="rounded-[14px] p-4 space-y-4"
          style={{ backgroundColor: 'white', boxShadow: 'var(--shadow)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>
            Dados clínicos
          </p>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
              Queixa principal <span style={{ color: 'var(--rose)' }}>*</span>
            </label>
            <textarea
              value={form.queixaPrincipal}
              onChange={e => set('queixaPrincipal', e.target.value)}
              placeholder="Ex: Ansiedade, insônia, lombalgia crônica..."
              rows={2}
              className={`input resize-none ${erros.queixaPrincipal ? 'border-red-400' : ''}`}
            />
            {erros.queixaPrincipal && (
              <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>{erros.queixaPrincipal}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
              Histórico e observações
            </label>
            <textarea
              value={form.observacoes}
              onChange={e => set('observacoes', e.target.value)}
              placeholder="Medicamentos em uso, condições associadas, histórico relevante..."
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
          {salvando ? 'Salvando...' : 'Cadastrar paciente'}
        </button>

        <div className="pb-6" />
      </div>
    </div>
  );
}
