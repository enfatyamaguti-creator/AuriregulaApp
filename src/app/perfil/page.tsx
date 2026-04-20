'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Lock, User } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';
import { createClient } from '@/lib/supabase';

export default function PerfilPage() {
  const router = useRouter();
  const [nome, setNome]             = useState('');
  const [email, setEmail]           = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha]   = useState('');
  const [confirmar, setConfirmar]   = useState('');
  const [salvandoNome, setSalvandoNome]   = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [erroNome, setErroNome]     = useState('');
  const [erroSenha, setErroSenha]   = useState('');
  const [okNome, setOkNome]         = useState('');
  const [okSenha, setOkSenha]       = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login'); return; }
      setNome(user.user_metadata?.nome ?? '');
      setEmail(user.email ?? '');
    });
  }, [router]);

  async function salvarNome(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) { setErroNome('Informe seu nome.'); return; }
    setSalvandoNome(true);
    setErroNome(''); setOkNome('');
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { nome: nome.trim() } });
    setSalvandoNome(false);
    if (error) { setErroNome('Erro ao salvar nome.'); return; }
    setOkNome('Nome atualizado com sucesso!');
  }

  async function salvarSenha(e: React.FormEvent) {
    e.preventDefault();
    setErroSenha(''); setOkSenha('');
    if (!novaSenha) { setErroSenha('Informe a nova senha.'); return; }
    if (novaSenha.length < 8) { setErroSenha('Mínimo de 8 caracteres.'); return; }
    if (novaSenha !== confirmar) { setErroSenha('As senhas não coincidem.'); return; }
    setSalvandoSenha(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    setSalvandoSenha(false);
    if (error) { setErroSenha('Erro ao alterar senha. Verifique sua sessão.'); return; }
    setOkSenha('Senha alterada com sucesso!');
    setSenhaAtual(''); setNovaSenha(''); setConfirmar('');
  }

  return (
    <div>
      <AppHeader titulo="Meu Perfil" subtitulo="Configurações da conta" voltar voltarHref="/home" />

      <div className="px-4 md:px-8 py-5 md:py-6 space-y-5 w-full max-w-2xl mx-auto">

        {/* Avatar */}
        <div className="flex flex-col items-center pt-2 pb-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
            style={{ backgroundColor: 'rgba(26,58,42,0.08)' }}
          >
            <User size={36} style={{ color: 'var(--forest)' }} />
          </div>
          <p className="text-xs" style={{ color: 'var(--gray)' }}>{email}</p>
        </div>

        {/* Nome */}
        <form onSubmit={salvarNome}
          className="rounded-[14px] p-4 space-y-4"
          style={{ backgroundColor: 'white', boxShadow: 'var(--shadow)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>
            Dados pessoais
          </p>
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
              Nome de exibição
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => { setNome(e.target.value); setErroNome(''); setOkNome(''); }}
              placeholder="Seu nome"
              className="input"
            />
          </div>
          {erroNome && <p className="text-xs" style={{ color: 'var(--rose)' }}>{erroNome}</p>}
          {okNome   && <p className="text-xs" style={{ color: 'var(--forest)' }}>{okNome}</p>}
          <button
            type="submit"
            disabled={salvandoNome}
            className="btn-primary w-full justify-center py-3"
            style={{ opacity: salvandoNome ? 0.7 : 1 }}
          >
            <Save size={16} />
            {salvandoNome ? 'Salvando...' : 'Salvar nome'}
          </button>
        </form>

        {/* Senha */}
        <form onSubmit={salvarSenha}
          className="rounded-[14px] p-4 space-y-4"
          style={{ backgroundColor: 'white', boxShadow: 'var(--shadow)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--gray)' }}>
            Alterar senha
          </p>
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
              Nova senha
            </label>
            <input
              type="password"
              value={novaSenha}
              onChange={e => { setNovaSenha(e.target.value); setErroSenha(''); setOkSenha(''); }}
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              className="input"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--charcoal)' }}>
              Confirmar nova senha
            </label>
            <input
              type="password"
              value={confirmar}
              onChange={e => { setConfirmar(e.target.value); setErroSenha(''); setOkSenha(''); }}
              placeholder="Repita a nova senha"
              className="input"
              autoComplete="new-password"
            />
          </div>
          {erroSenha && <p className="text-xs" style={{ color: 'var(--rose)' }}>{erroSenha}</p>}
          {okSenha   && <p className="text-xs" style={{ color: 'var(--forest)' }}>{okSenha}</p>}
          <button
            type="submit"
            disabled={salvandoSenha}
            className="btn-primary w-full justify-center py-3"
            style={{ opacity: salvandoSenha ? 0.7 : 1 }}
          >
            <Lock size={16} />
            {salvandoSenha ? 'Alterando...' : 'Alterar senha'}
          </button>
        </form>

        <div className="pb-6" />
      </div>
    </div>
  );
}
