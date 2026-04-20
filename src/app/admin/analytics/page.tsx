import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { Users, UserCheck, CalendarDays, ClipboardList, TrendingUp } from 'lucide-react';

async function getContagem(supabase: Awaited<ReturnType<typeof createServerSupabase>>, tabela: string) {
  const { count } = await supabase.from(tabela).select('*', { count: 'exact', head: true });
  return count ?? 0;
}

export default async function AdminAnalyticsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/home');
  }

  const [totalPacientes, totalSessoes, totalAgendamentos] = await Promise.all([
    getContagem(supabase, 'pacientes'),
    getContagem(supabase, 'sessoes'),
    getContagem(supabase, 'agendamentos'),
  ]);

  const { data: assinaturas } = await supabase
    .from('assinaturas')
    .select('status, plano');

  const totalAtivos   = assinaturas?.filter(a => a.status === 'ativo').length   ?? 0;
  const totalExpirados = assinaturas?.filter(a => a.status === 'expirado').length ?? 0;

  const { data: usuariosRecentes } = await supabase
    .from('profiles')
    .select('id, nome, email, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  const cards = [
    { label: 'Pacientes cadastrados', valor: totalPacientes,    icon: Users,         cor: 'var(--forest)' },
    { label: 'Sessões registradas',   valor: totalSessoes,      icon: ClipboardList, cor: 'var(--forest)' },
    { label: 'Agendamentos',          valor: totalAgendamentos, icon: CalendarDays,  cor: 'var(--gold)'   },
    { label: 'Assinaturas ativas',    valor: totalAtivos,       icon: UserCheck,     cor: 'var(--forest)' },
    { label: 'Assinaturas expiradas', valor: totalExpirados,    icon: TrendingUp,    cor: 'var(--rose)'   },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>

      {/* Header */}
      <header
        className="px-5 md:px-10 pt-8 pb-6"
        style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Admin
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Analytics</h1>
        </div>
      </header>

      <div className="px-4 md:px-10 py-6 space-y-6 w-full max-w-5xl mx-auto">

        {/* Cards de métricas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {cards.map(({ label, valor, icon: Icon, cor }) => (
            <div key={label} className="card p-4 text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: `${cor}12` }}
              >
                <Icon size={18} style={{ color: cor }} />
              </div>
              <p className="font-display text-3xl font-bold" style={{ color: 'var(--charcoal)' }}>{valor}</p>
              <p className="text-[11px] mt-0.5 leading-tight" style={{ color: 'var(--gray)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Usuários recentes */}
        <div className="card p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--gray)' }}>
            Usuários recentes
          </p>
          {(usuariosRecentes ?? []).length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: 'var(--gray-light)' }}>
              Nenhum usuário encontrado
            </p>
          ) : (
            <div className="space-y-2">
              {(usuariosRecentes ?? []).map(u => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b last:border-0"
                  style={{ borderColor: 'var(--border-card)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
                      {(u.nome as string) || '—'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--gray)' }}>{u.email as string}</p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--gray-light)' }}>
                    {new Date(u.created_at as string).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assinaturas por plano */}
        {(assinaturas ?? []).length > 0 && (
          <div className="card p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--gray)' }}>
              Assinaturas por plano
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(['mensal', 'semestral', 'anual'] as const).map(plano => {
                const total = assinaturas?.filter(a => a.plano === plano).length ?? 0;
                return (
                  <div key={plano} className="text-center p-3 rounded-[12px]"
                    style={{ backgroundColor: 'rgba(26,58,42,0.05)' }}>
                    <p className="font-display text-2xl font-bold" style={{ color: 'var(--charcoal)' }}>{total}</p>
                    <p className="text-xs capitalize mt-0.5" style={{ color: 'var(--gray)' }}>{plano}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
