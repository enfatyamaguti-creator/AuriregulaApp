'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase';

function CadastroForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const emailParam   = searchParams.get('email') ?? '';

  const [etapa, setEtapa]           = useState<'verificando' | 'form' | 'modal' | 'sucesso' | 'negado'>('verificando');
  const [email, setEmail]           = useState(emailParam);
  const [nome, setNome]             = useState('');
  const [senha, setSenha]           = useState('');
  const [confirmar, setConfirmar]   = useState('');
  const [verSenha, setVerSenha]     = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro]             = useState('');

  useEffect(() => {
    if (!emailParam) { setEtapa('negado'); return; }
    fetch(`/api/cadastro/verificar?email=${encodeURIComponent(emailParam)}`)
      .then(r => r.json())
      .then(({ autorizado, emailExiste }) => {
        if (!autorizado) { setEtapa('negado'); return; }
        setEtapa(emailExiste ? 'modal' : 'form');
      })
      .catch(() => setEtapa('negado'));
  }, [emailParam]);

  async function handleManterConta() {
    setCarregando(true); setErro('');
    const res  = await fetch('/api/cadastro/ativar', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: emailParam, opcao: 'manter_conta' }),
    });
    const json = await res.json();
    setCarregando(false);
    if (!res.ok) { setErro(json.error ?? 'Erro ao ativar.'); return; }
    setEtapa('sucesso');
  }

  async function handleNovaConta(e: React.FormEvent) {
    e.preventDefault();
    if (senha !== confirmar) { setErro('As senhas não coincidem.'); return; }
    if (senha.length < 8)    { setErro('Senha mínima de 8 caracteres.'); return; }
    if (!nome.trim())        { setErro('Informe seu nome.'); return; }
    setCarregando(true); setErro('');

    const res  = await fetch('/api/cadastro/ativar', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, nome, senha, opcao: 'nova_conta' }),
    });
    const json = await res.json();
    setCarregando(false);
    if (!res.ok) { setErro(json.error ?? 'Erro ao criar conta.'); return; }

    // Faz login automaticamente
    const supabase = createClient();
    await supabase.auth.signInWithPassword({ email, password: senha });
    router.refresh();
    router.push('/home');
  }

  // ── Verificando ────────────────────────────────────────────────────────────
  if (etapa === 'verificando') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--forest)', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: 'var(--gray)' }}>Verificando sua compra...</p>
      </div>
    );
  }

  // ── Acesso negado ──────────────────────────────────────────────────────────
  if (etapa === 'negado') {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: 'rgba(155,58,58,0.10)' }}>
          <AlertCircle size={30} style={{ color: 'var(--rose)' }} />
        </div>
        <h2 className="font-display text-xl font-bold" style={{ color: 'var(--charcoal)' }}>
          Acesso não autorizado
        </h2>
        <p className="text-sm" style={{ color: 'var(--gray)' }}>
          Este link é válido somente após a confirmação de pagamento pela Kiwify. Se você já comprou, verifique o email cadastrado na compra.
        </p>
        <Link href="/#planos"
          className="inline-block px-6 py-2.5 rounded-[10px] text-sm font-semibold transition-all"
          style={{ backgroundColor: 'var(--forest)', color: 'white' }}>
          Ver planos
        </Link>
      </div>
    );
  }

  // ── Sucesso ────────────────────────────────────────────────────────────────
  if (etapa === 'sucesso') {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: 'rgba(26,58,42,0.10)' }}>
          <CheckCircle size={30} style={{ color: 'var(--forest)' }} />
        </div>
        <h2 className="font-display text-xl font-bold" style={{ color: 'var(--charcoal)' }}>
          Assinatura ativada!
        </h2>
        <p className="text-sm" style={{ color: 'var(--gray)' }}>
          Sua conta foi ativada com sucesso. Faça login para acessar o app.
        </p>
        <Link href="/login"
          className="inline-block px-6 py-2.5 rounded-[10px] text-sm font-semibold transition-all"
          style={{ backgroundColor: 'var(--forest)', color: 'white' }}>
          Fazer login
        </Link>
      </div>
    );
  }

  // ── Modal: email já existe ─────────────────────────────────────────────────
  if (etapa === 'modal') {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: 'rgba(184,151,74,0.12)' }}>
            <AlertCircle size={26} style={{ color: 'var(--gold)' }} />
          </div>
          <h2 className="font-display text-xl font-bold" style={{ color: 'var(--charcoal)' }}>
            Email já cadastrado
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--gray)' }}>
            O email <strong>{emailParam}</strong> já possui uma conta no AuriRegula Pro.
            Deseja ativar a assinatura nesta conta ou usar um email diferente?
          </p>
        </div>

        {erro && (
          <p className="text-sm text-center p-3 rounded-[10px]"
            style={{ backgroundColor: 'rgba(139,58,82,0.10)', color: 'var(--rose)' }}>
            {erro}
          </p>
        )}

        <button onClick={handleManterConta} disabled={carregando}
          className="w-full py-3 rounded-[12px] text-sm font-bold transition-all active:scale-95"
          style={{ backgroundColor: 'var(--forest)', color: 'white', opacity: carregando ? 0.7 : 1 }}>
          {carregando ? 'Ativando...' : 'Sim, usar esta conta'}
        </button>

        <button onClick={() => setEtapa('form')}
          className="w-full py-3 rounded-[12px] text-sm font-semibold transition-all active:scale-95 border"
          style={{ color: 'var(--charcoal)', borderColor: 'var(--border-card)', backgroundColor: 'white' }}>
          Usar um email diferente
        </button>
      </div>
    );
  }

  // ── Formulário de cadastro ─────────────────────────────────────────────────
  return (
    <form onSubmit={handleNovaConta} className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--charcoal)' }}>
          Nome completo
        </label>
        <input type="text" value={nome} onChange={e => setNome(e.target.value)}
          placeholder="Seu nome completo" required className="input" autoFocus />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--charcoal)' }}>
          Email
        </label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com" required className="input" />
        {email !== emailParam && (
          <p className="text-xs mt-1" style={{ color: 'var(--gold)' }}>
            Use o mesmo email da compra para garantir a ativação automática.
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--charcoal)' }}>
          Senha
        </label>
        <div className="relative">
          <input type={verSenha ? 'text' : 'password'} value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Mínimo 8 caracteres" required minLength={8} className="input pr-11" />
          <button type="button" onClick={() => setVerSenha(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--gray-light)' }}>
            {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--charcoal)' }}>
          Confirmar senha
        </label>
        <input type={verSenha ? 'text' : 'password'} value={confirmar}
          onChange={e => setConfirmar(e.target.value)}
          placeholder="Repita a senha" required minLength={8} className="input" />
      </div>

      {erro && (
        <p className="text-sm p-3 rounded-[10px]"
          style={{ backgroundColor: 'rgba(139,58,82,0.10)', color: 'var(--rose)' }}>
          {erro}
        </p>
      )}

      <button type="submit" disabled={carregando}
        className="btn-primary w-full justify-center py-3.5 mt-2"
        style={{ opacity: carregando ? 0.7 : 1 }}>
        <UserPlus size={18} />
        {carregando ? 'Criando conta...' : 'Criar conta e acessar'}
      </button>

      <p className="text-xs text-center" style={{ color: 'var(--gray-light)' }}>
        Ao criar uma conta você concorda com os{' '}
        <Link href="/termos" className="underline" style={{ color: 'var(--gray)' }}>termos de uso</Link>.
      </p>
    </form>
  );
}

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: 'var(--cream)' }}>

      {/* Painel esquerdo — branding */}
      <div className="hidden md:flex md:w-1/2 md:flex-col md:justify-between px-12 py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}>
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'var(--gold)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-8"
          style={{ background: 'var(--gold)', transform: 'translate(-30%,30%)' }} />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Método R.E.G.U.L.A.®
          </p>
          <h1 className="font-display text-4xl font-bold text-white leading-tight">AuriRegula Pro</h1>
          <p className="text-base mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Auriculoterapia Clínica Baseada no Raciocínio Neurofisiológico
          </p>
        </div>
        <div className="relative p-5 rounded-[16px]"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderLeft: '3px solid var(--gold)' }}>
          <p className="text-base italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.90)' }}>
            "Seu corpo não está apenas doente. Muitas vezes, ele está desregulado."
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden px-6 pt-14 pb-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: 'var(--gold)', transform: 'translate(30%,-30%)' }} />
          <p className="text-xs font-medium uppercase tracking-widest mb-1 relative" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Método R.E.G.U.L.A.®
          </p>
          <h1 className="font-display text-3xl font-bold text-white relative">AuriRegula Pro</h1>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-0">
          <div className="w-full max-w-sm md:max-w-md">
            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: 'var(--charcoal)' }}>
                Criar sua conta
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--gray)' }}>
                Bem-vindo ao AuriRegula Pro — configure seu acesso
              </p>
            </div>
            <Suspense fallback={
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--forest)', borderTopColor: 'transparent' }} />
              </div>
            }>
              <CadastroForm />
            </Suspense>
            <p className="text-xs text-center mt-6" style={{ color: 'var(--gray-light)' }}>
              Já tem conta?{' '}
              <Link href="/login" className="underline" style={{ color: 'var(--forest)' }}>Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
