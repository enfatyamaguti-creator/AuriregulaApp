'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { createClient } from '@/lib/supabase';

type Modo = 'login' | 'signup';

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get('redirect') || '/home';

  const [modo, setModo]             = useState<Modo>('login');
  const [email, setEmail]           = useState('');
  const [senha, setSenha]           = useState('');
  const [nome, setNome]             = useState('');
  const [verSenha, setVerSenha]     = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro]             = useState('');
  const [sucesso, setSucesso]       = useState('');

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(''); setSucesso(''); setCarregando(true);

    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) { setErro('Email ou senha incorretos.'); setCarregando(false); return; }
      router.push(redirect);
      router.refresh();
    } else {
      if (!nome.trim()) { setErro('Informe seu nome.'); setCarregando(false); return; }
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { role: 'user', nome: nome.trim() } },
      });
      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already')) {
          setErro('Este email já está cadastrado. Tente fazer login.');
        } else {
          setErro(`Erro ao cadastrar: ${error.message}`);
        }
        setCarregando(false); return;
      }
      // Se o Supabase retornou sessão (confirmação de email desabilitada) → login direto
      if (data.session) {
        router.push(redirect);
        router.refresh();
        return;
      }
      // Confirmação de email habilitada → orienta o usuário
      setSucesso('Cadastro realizado! Verifique seu email e clique no link de confirmação para ativar sua conta.');
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: 'var(--cream)' }}>

      {/* Painel esquerdo — branding (somente desktop) */}
      <div
        className="hidden md:flex md:w-1/2 md:flex-col md:justify-between px-12 py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}
      >
        {/* Círculos decorativos */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'var(--gold)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-8"
          style={{ background: 'var(--gold)', transform: 'translate(-30%,30%)' }} />

        {/* Logo */}
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Método R.E.G.U.L.A.®
          </p>
          <h1 className="font-display text-4xl font-bold text-white leading-tight">
            AuriRegula Pro
          </h1>
          <p className="text-base mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Auriculoterapia Clínica Baseada no Raciocínio Neurofisiológico
          </p>
        </div>

        {/* Citação */}
        <div className="relative">
          <div className="p-5 rounded-[16px]" style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderLeft: '3px solid var(--gold)' }}>
            <p className="text-base italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.90)' }}>
              "Seu corpo não está apenas doente. Muitas vezes, ele está desregulado."
            </p>
          </div>

          {/* Acrônimo resumido */}
          <div className="mt-8 space-y-2">
            {[['R','Regulação do sistema nervoso autônomo'],['E','Equilíbrio neuroendócrino'],['G','Gestão da resposta inflamatória']].map(([l,d]) => (
              <div key={l} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: 'var(--gold)', color: 'white' }}>{l}</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col">

        {/* Mobile hero */}
        <div
          className="md:hidden px-6 pt-14 pb-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: 'var(--gold)', transform: 'translate(30%,-30%)' }} />
          <p className="text-xs font-medium uppercase tracking-widest mb-1 relative" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Método R.E.G.U.L.A.®
          </p>
          <h1 className="font-display text-3xl font-bold text-white relative">AuriRegula Pro</h1>
        </div>

        {/* Formulário */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-0">
          <div className="w-full max-w-sm md:max-w-md">

            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: 'var(--charcoal)' }}>
                {modo === 'login' ? 'Entrar na conta' : 'Criar conta'}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--gray)' }}>
                {modo === 'login' ? 'Bem-vinda de volta' : 'Preencha os dados para criar seu acesso'}
              </p>
            </div>

            {/* Seletor login / signup */}
            <div className="flex rounded-[12px] p-1 mb-6" style={{ backgroundColor: 'rgba(26,58,42,0.08)' }}>
              {(['login', 'signup'] as Modo[]).map(m => (
                <button key={m}
                  onClick={() => { setModo(m); setErro(''); setSucesso(''); }}
                  className="flex-1 py-2 rounded-[10px] text-sm font-semibold transition-all"
                  style={{ backgroundColor: modo === m ? 'var(--forest)' : 'transparent', color: modo === m ? 'white' : 'var(--gray)' }}
                >
                  {m === 'login' ? 'Entrar' : 'Cadastrar'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {modo === 'signup' && (
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--charcoal)' }}>Nome completo</label>
                  <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                    placeholder="Seu nome" required className="input" />
                </div>
              )}

              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--charcoal)' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com" required autoComplete="email" className="input" />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--charcoal)' }}>Senha</label>
                <div className="relative">
                  <input
                    type={verSenha ? 'text' : 'password'} value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder={modo === 'signup' ? 'Mínimo 8 caracteres' : '••••••••'}
                    required minLength={8}
                    autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
                    className="input pr-11"
                  />
                  <button type="button" onClick={() => setVerSenha(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--gray-light)' }}>
                    {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {erro && (
                <div className="p-3 rounded-[10px] text-sm" style={{ backgroundColor: 'rgba(139,58,82,0.10)', color: 'var(--rose)' }}>
                  {erro}
                </div>
              )}
              {sucesso && (
                <div className="p-3 rounded-[10px] text-sm" style={{ backgroundColor: 'rgba(26,58,42,0.10)', color: 'var(--forest)' }}>
                  {sucesso}
                </div>
              )}

              <button type="submit" disabled={carregando}
                className="btn-primary w-full justify-center py-3.5 mt-2"
                style={{ opacity: carregando ? 0.7 : 1 }}>
                {modo === 'login'
                  ? <><LogIn size={18} />{carregando ? 'Entrando...' : 'Entrar'}</>
                  : <><UserPlus size={18} />{carregando ? 'Cadastrando...' : 'Criar conta'}</>}
              </button>
            </form>

            {modo === 'login' && (
              <div className="text-center mt-3">
                <Link href="/esqueci-senha" className="text-xs transition-colors" style={{ color: 'var(--forest)' }}>
                  Esqueci minha senha
                </Link>
              </div>
            )}

            <p className="text-xs text-center mt-4 leading-relaxed" style={{ color: 'var(--gray-light)' }}>
              {modo === 'signup'
                ? <>Ao criar uma conta você concorda com os{' '}
                    <Link href="/termos" className="underline" style={{ color: 'var(--gray)' }}>termos de uso</Link>
                    {' '}do AuriRegula Pro.</>
                : 'Não tem acesso? Entre em contato para adquirir sua licença.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
