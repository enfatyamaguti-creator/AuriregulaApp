import Link from 'next/link';
import { BookOpen, ClipboardList, Users, Star, Heart, Zap, CalendarDays } from 'lucide-react';
import { PROTOCOLO_MASTER } from '@/lib/protocolos';
import { createServerSupabase } from '@/lib/supabase-server';
import OnboardingModal from '@/components/OnboardingModal';

const ATALHOS = [
  { href: '/protocolos',  label: 'Protocolos',      icon: BookOpen,      cor: 'forest', desc: '100+ protocolos clínicos' },
  { href: '/avaliacao',   label: 'Avaliação',        icon: ClipboardList, cor: 'forest', desc: 'Sugerir protocolo'        },
  { href: '/agendamento', label: 'Agenda',           icon: CalendarDays,  cor: 'forest', desc: 'Agendar sessões'          },
  { href: '/mulher',      label: 'Saúde da Mulher',  icon: Heart,         cor: 'rose',   desc: 'Módulo 40+'              },
  { href: '/populacoes',  label: 'Populações',       icon: Zap,           cor: 'amber',  desc: 'Pediatria, Idosos, Esporte' },
  { href: '/pacientes',   label: 'Pacientes',        icon: Users,         cor: 'forest', desc: 'Prontuários'             },
];

const COR_BG: Record<string, string> = {
  forest: 'rgba(26,58,42,0.08)',
  rose:   'rgba(139,58,82,0.08)',
  amber:  'rgba(184,151,74,0.10)',
};
const COR_ICONE: Record<string, string> = {
  forest: 'var(--forest)',
  rose:   'var(--rose)',
  amber:  'var(--gold)',
};

export default async function HomePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const primeiroNome = (user?.user_metadata?.nome as string | undefined)
    ?.split(' ')[0] ?? 'Bem-vinda';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>

      <header
        className="px-5 md:px-8 pt-10 md:pt-14 pb-8 md:pb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}
      >
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10"
          style={{ background: 'var(--gold)', transform: 'translate(30%, -30%)' }} />
        <div className="relative max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest mb-1 md:hidden" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Método R.E.G.U.L.A.®
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            <span className="md:hidden">AuriRegula Pro</span>
            <span className="hidden md:inline">Olá, {primeiroNome}</span>
          </h1>
          <p className="text-sm md:text-base mt-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Auriculoterapia Clínica Baseada no Raciocínio Neurofisiológico
          </p>
          <div className="mt-5 p-3 rounded-[12px] max-w-xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderLeft: '3px solid var(--gold)' }}>
            <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.90)' }}>
              "Seu corpo não está apenas doente. Muitas vezes, ele está desregulado."
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-8 py-5 md:py-7 space-y-5 md:space-y-7 w-full max-w-4xl mx-auto">

        <Link href="/protocolos/master-regula" className="block">
          <div
            className="rounded-[16px] p-4 md:p-5 flex items-center gap-4 transition-all hover:scale-[0.99] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', boxShadow: '0 4px 20px rgba(184,151,74,0.30)' }}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
              <Star size={22} fill="white" color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-white opacity-80">Base de todos os protocolos</p>
              <p className="font-display text-lg md:text-xl font-bold text-white leading-tight">Protocolo Master R.E.G.U.L.A.®</p>
              <p className="text-xs text-white opacity-75 mt-0.5">
                {PROTOCOLO_MASTER.pontos.slice(0, 4).join(' · ')}...
              </p>
            </div>
            <div className="text-xl" style={{ color: 'rgba(255,255,255,0.8)' }}>›</div>
          </div>
        </Link>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--gray)' }}>Acesso rápido</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 md:gap-3">
            {ATALHOS.map(({ href, label, icon: Icon, cor, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-[14px] text-center transition-all hover:shadow-md active:scale-95"
                style={{ backgroundColor: 'white', boxShadow: 'var(--shadow)', border: '1px solid var(--border-card)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COR_BG[cor] }}>
                  <Icon size={18} style={{ color: COR_ICONE[cor] }} />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--charcoal)' }}>{label}</p>
                  <p className="text-[10px] mt-0.5 leading-tight hidden md:block" style={{ color: 'var(--gray-light)' }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-4 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--gray)' }}>
            O Método R.E.G.U.L.A.®
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            {[
              ['R', 'Regulação do sistema nervoso autônomo'],
              ['E', 'Equilíbrio neuroendócrino'],
              ['G', 'Gestão da resposta inflamatória'],
              ['U', 'Unificação corpo-mente'],
              ['L', 'Liberação das vias inibitórias endógenas'],
              ['A', 'Ativação da homeostase sistêmica'],
            ].map(([letra, desc]) => (
              <div key={letra} className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: 'var(--forest)', color: 'white' }}
                >
                  {letra}
                </span>
                <span className="text-sm" style={{ color: 'var(--charcoal)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <OnboardingModal />
    </div>
  );
}
