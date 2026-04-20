'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ClipboardList, Users, CalendarDays } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/home',         label: 'Início',      icon: Home          },
  { href: '/protocolos',   label: 'Protocolos',  icon: BookOpen      },
  { href: '/avaliacao',    label: 'Avaliar',      icon: ClipboardList },
  { href: '/pacientes',    label: 'Pacientes',   icon: Users         },
  { href: '/agendamento',  label: 'Agenda',      icon: CalendarDays  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        backgroundColor: 'white',
        borderColor: 'rgba(26,58,42,0.10)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/home' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all relative"
              style={{ color: active ? 'var(--forest)' : 'var(--gray-light)' }}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
              <span
                className="text-[10px] font-medium leading-none"
                style={{ color: active ? 'var(--forest)' : 'var(--gray-light)' }}
              >
                {label}
              </span>
              {active && (
                <span
                  className="absolute bottom-0 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--forest)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
