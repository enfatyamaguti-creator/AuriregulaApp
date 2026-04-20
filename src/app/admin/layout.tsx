import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import AdminNav from '@/components/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/home');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <AdminNav />
      {children}
    </div>
  );
}
