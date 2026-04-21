'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ClipboardList, Users, Star, X } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function OnboardingModal() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && !user.user_metadata?.onboarding_done) {
        setVisivel(true);
      }
    });
  }, []);

  async function fechar() {
    setVisivel(false);
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { onboarding_done: true } });
  }

  if (!visivel) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
    >
      <div
        className="w-full md:max-w-md rounded-t-[24px] md:rounded-[20px] overflow-hidden"
        style={{ backgroundColor: 'white' }}
      >
        {/* Header */}
        <div className="relative px-6 pt-8 pb-5"
          style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}>
          <button
            onClick={fechar}
            className="absolute top-4 right-4 p-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <X size={16} color="white" />
          </button>
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Bem-vinda ao
          </p>
          <h2 className="font-display text-2xl font-bold text-white">AuriRegula Pro</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Sua plataforma de Auriculoterapia Clínica
          </p>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm" style={{ color: 'var(--charcoal)' }}>
            Explore os recursos disponíveis:
          </p>

          {[
            { icon: Star,         cor: 'var(--gold)',    titulo: 'Protocolo Master R.E.G.U.L.A.®', desc: 'Base de todos os protocolos clínicos' },
            { icon: BookOpen,     cor: 'var(--forest)',  titulo: '100+ Protocolos Clínicos',        desc: 'Organizados por queixa e categoria'  },
            { icon: ClipboardList, cor: 'var(--forest)', titulo: 'Avaliação Guiada',                desc: 'Sugestão de protocolo por sintomas'   },
            { icon: Users,        cor: 'var(--forest)',  titulo: 'Gestão de Pacientes',             desc: 'Prontuários e evolução clínica'       },
          ].map(({ icon: Icon, cor, titulo, desc }) => (
            <div key={titulo} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${cor}18` }}>
                <Icon size={16} style={{ color: cor }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{titulo}</p>
                <p className="text-xs" style={{ color: 'var(--gray)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-7">
          <button
            onClick={fechar}
            className="btn-primary w-full justify-center py-3.5"
          >
            Começar a usar
          </button>
        </div>
      </div>
    </div>
  );
}
