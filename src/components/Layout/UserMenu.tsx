'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function UserMenu() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-[8px] transition-all active:scale-95"
      style={{ color: 'var(--gray)', backgroundColor: 'rgba(0,0,0,0.04)' }}
      title="Sair"
    >
      <LogOut size={14} />
      Sair
    </button>
  );
}
