'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function EsqueciSenhaPage() {
  const [email, setEmail]           = useState('');
  const [enviado, setEnviado]       = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro]             = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setErro('Informe seu email.'); return; }
    setErro(''); setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/perfil`,
    });
    setCarregando(false);
    if (error) { setErro('Não foi possível enviar o email. Verifique o endereço informado.'); return; }
    setEnviado(true);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: 'var(--cream)' }}>

      <div
        className="hidden md:flex md:w-1/2 md:flex-col md:justify-center px-12 py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'var(--gold)', transform: 'translate(30%,-30%)' }} />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Método R.E.G.U.L.A.®
          </p>
          <h1 className="font-display text-4xl font-bold text-white leading-tight">AuriRegula Pro</h1>
          <p className="text-base mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Auriculoterapia Clínica Baseada no Raciocínio Neurofisiológico
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div
          className="md:hidden px-6 pt-14 pb-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest mb-1 relative" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Método R.E.G.U.L.A.®
          </p>
          <h1 className="font-display text-3xl font-bold text-white relative">AuriRegula Pro</h1>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-0">
          <div className="w-full max-w-sm md:max-w-md">

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
              style={{ color: 'var(--gray)' }}
            >
              <ArrowLeft size={15} />
              Voltar ao login
            </Link>

            {!enviado ? (
              <>
                <div className="mb-8">
                  <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: 'var(--charcoal)' }}>
                    Recuperar senha
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--gray)' }}>
                    Enviaremos um link para redefinir sua senha
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--charcoal)' }}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErro(''); }}
                      placeholder="seu@email.com"
                      required
                      autoComplete="email"
                      className="input"
                    />
                  </div>

                  {erro && (
                    <div className="p-3 rounded-[10px] text-sm" style={{ backgroundColor: 'rgba(139,58,82,0.10)', color: 'var(--rose)' }}>
                      {erro}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={carregando}
                    className="btn-primary w-full justify-center py-3.5"
                    style={{ opacity: carregando ? 0.7 : 1 }}
                  >
                    <Mail size={17} />
                    {carregando ? 'Enviando...' : 'Enviar link de recuperação'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: 'rgba(26,58,42,0.08)' }}
                >
                  <Mail size={28} style={{ color: 'var(--forest)' }} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--charcoal)' }}>
                    Email enviado!
                  </h2>
                  <p className="text-sm mt-2" style={{ color: 'var(--gray)' }}>
                    Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--gray-light)' }}>
                    Não recebeu? Verifique a pasta de spam.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="inline-block mt-4 px-6 py-2.5 rounded-[12px] text-sm font-semibold"
                  style={{ backgroundColor: 'var(--forest)', color: 'white' }}
                >
                  Voltar ao login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
