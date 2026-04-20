'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, ClipboardList, Users, CalendarDays, Star, LogOut, Heart, Zap, UserCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase';

const NAV_ITEMS = [
  { href: '/home',         label: 'Início',          icon: Home          },
  { href: '/protocolos',   label: 'Protocolos',      icon: BookOpen      },
  { href: '/avaliacao',    label: 'Avaliação',        icon: ClipboardList },
  { href: '/pacientes',    label: 'Pacientes',        icon: Users         },
  { href: '/agendamento',  label: 'Agenda',           icon: CalendarDays  },
  { href: '/mulher',       label: 'Saúde da Mulher',  icon: Heart         },
  { href: '/populacoes',   label: 'Populações',       icon: Zap           },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside
      className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-56 md:z-40 overflow-y-auto"
      style={{ backgroundColor: 'var(--forest)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Brand */}
      <div className="px-5 pt-7 pb-5 flex-shrink-0">
        <p className="text-[10px] font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Método R.E.G.U.L.A.®
        </p>
        <h2 className="font-display text-[1.35rem] font-bold text-white leading-tight">
          AuriRegula Pro
        </h2>
      </div>

      {/* Protocolo Master */}
      <div className="px-3 mb-3 flex-shrink-0">
        <Link
          href="/protocolos/master-regula"
          className="flex items-center gap-2 px-3 py-2 rounded-[10px] transition-all"
          style={{ backgroundColor: 'rgba(184,151,74,0.18)', border: '1px solid rgba(184,151,74,0.28)' }}
        >
          <Star size={13} fill="var(--gold)" color="var(--gold)" />
          <span className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>Protocolo Master</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/home' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all"
              style={{
                backgroundColor: active ? 'rgba(255,255,255,0.13)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.60)',
              }}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.7} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 space-y-1 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Link
          href="/perfil"
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[10px] text-sm font-medium transition-all"
          style={{
            color: pathname === '/perfil' ? 'white' : 'rgba(255,255,255,0.55)',
            backgroundColor: pathname === '/perfil' ? 'rgba(255,255,255,0.13)' : 'transparent',
          }}
        >
          <UserCircle size={16} />
          Meu perfil
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[10px] text-sm font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.55)', backgroundColor: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
