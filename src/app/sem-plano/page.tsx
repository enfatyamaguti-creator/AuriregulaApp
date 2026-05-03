'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ShieldOff, LogOut } from 'lucide-react';

export default function SemPlanoPage() {
  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>

      <div className="px-5 py-16">
        <div className="max-w-md w-full text-center space-y-6">

          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: 'rgba(155,58,58,0.10)' }}
          >
            <ShieldOff size={36} style={{ color: 'var(--rose)' }} />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: 'var(--charcoal)' }}>
              Sua conta não possui um plano ativo
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gray)' }}>
              Para acessar o AuriRegula Pro, você precisa de uma assinatura ativa.
              Escolha o plano ideal para sua prática e comece agora.
            </p>
          </div>

          <div
            className="p-4 rounded-[14px] text-left"
            style={{ backgroundColor: 'white', boxShadow: 'var(--shadow)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--gray)' }}>
              O que você terá acesso
            </p>
            {[
              '100+ protocolos clínicos organizados por queixa',
              'Gestão de pacientes e prontuários digitais',
              'Agenda de sessões integrada',
              'Método R.E.G.U.L.A.® com base neurofisiológica',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 mb-2">
                <span className="text-sm" style={{ color: 'var(--forest)' }}>✓</span>
                <span className="text-sm" style={{ color: 'var(--charcoal)' }}>{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/#planos"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-[12px] text-sm font-bold transition-all active:scale-95"
            style={{ backgroundColor: 'var(--forest)', color: 'white', boxShadow: '0 4px 20px rgba(26,58,42,0.25)' }}
          >
            Ver planos e assinar
          </Link>

          <p className="text-xs" style={{ color: 'var(--gray-light)' }}>
            Já assinou? Aguarde alguns instantes — a ativação pode levar até 2 minutos após o pagamento.
          </p>
        </div>
      </div>

      <button
        onClick={sair}
        className="flex items-center gap-1.5 text-xs mb-8 transition-all"
        style={{ color: 'var(--gray-light)' }}
      >
        <LogOut size={13} />
        Sair da conta
      </button>
    </div>
  );
}
