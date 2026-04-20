'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart2, MapPin, Home, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase';

const NAV_ITEMS = [
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/calibrar',  label: 'Calibrar',  icon: MapPin    },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-2.5 gap-4"
      style={{ background: '#1a3a2a', boxShadow: '0 1px 8px rgba(0,0,0,0.25)' }}
    >
      {/* Brand */}
      <Link href="/admin/analytics" className="flex items-center gap-2.5 flex-shrink-0">
        <Image
          src="/images/AuriRegulaLogo.jpeg"
          alt="AuriRegula Pro"
          width={32}
          height={32}
          className="rounded-[7px] object-cover"
        />
        <div className="hidden md:block">
          <p className="text-[9px] font-medium uppercase tracking-widest leading-none" style={{ color: 'rgba(255,255,255,0.45)' }}>Admin</p>
          <p className="text-sm font-bold text-white leading-tight">AuriRegula Pro</p>
        </div>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all"
              style={{
                backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.60)',
              }}
            >
              <Icon size={14} strokeWidth={active ? 2.2 : 1.7} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Link
          href="/home"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          <Home size={14} />
          <span className="hidden md:inline">Voltar ao app</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all"
          style={{ backgroundColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.70)' }}
        >
          <LogOut size={14} />
          <span className="hidden md:inline">Sair</span>
        </button>
      </div>
    </nav>
  );
}
