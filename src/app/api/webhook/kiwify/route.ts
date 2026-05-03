import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Dias de acesso por frequência do plano
const DIAS_POR_FREQUENCIA: Record<string, number> = {
  monthly: 31,
  yearly:  366,
};

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

function addDias(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString();
}

async function ativarAssinatura(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
  metadata: Record<string, unknown>,
  plano: string,
  dias: number,
) {
  const expiracao = addDias(dias);
  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { ...metadata, subscription_status: 'ativo' },
  });
  await supabase.from('assinaturas').upsert({
    user_id:        userId,
    status:         'ativo',
    plano,
    data_expiracao: expiracao,
    updated_at:     new Date().toISOString(),
  }, { onConflict: 'user_id' });
  return expiracao;
}

export async function POST(req: NextRequest) {
  // ── 1. Valida token (query param: ?token=SEU_TOKEN) ───────────────────────
  const secret = process.env.KIWIFY_WEBHOOK_SECRET;
  if (secret) {
    const token = req.nextUrl.searchParams.get('token');
    if (token !== secret) {
      console.warn('[webhook] Token inválido:', token);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── 2. Parse payload ──────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  // LOG TEMPORÁRIO — remover após identificar estrutura real
  console.log('[webhook] PAYLOAD COMPLETO:', JSON.stringify(body, null, 2));

  const event     = body.event as string | undefined;
  const customer  = body.Customer as Record<string, string> | undefined;
  const sub       = body.Subscription as Record<string, unknown> | undefined;
  const plan      = sub?.plan as Record<string, unknown> | undefined;

  const email     = customer?.email?.toLowerCase();
  const frequency = (plan?.frequency as string | undefined) ?? 'monthly';
  const planName  = (plan?.name as string | undefined) ?? frequency;

  if (!email) return NextResponse.json({ error: 'Email ausente no payload' }, { status: 400 });

  const dias = DIAS_POR_FREQUENCIA[frequency] ?? 31;

  const supabase = adminClient();
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email?.toLowerCase() === email);

  // ── 3. order_approved ─────────────────────────────────────────────────────
  if (event === 'order_approved') {
    if (user) {
      const expiracao = await ativarAssinatura(supabase, user.id, user.user_metadata ?? {}, planName, dias);
      console.log(`[webhook] ✅ Reativado: ${email} | plano: ${planName} | expira: ${expiracao}`);
      return NextResponse.json({ ok: true, action: 'reativado', expiracao });
    }

    // Usuário não existe → cria pendência para o /cadastro
    await supabase.from('cadastros_pendentes').insert({ email, offer_id: planName, dias });
    console.log(`[webhook] 🕐 Pendência criada: ${email} | plano: ${planName}`);
    return NextResponse.json({ ok: true, action: 'pendente_cadastro', email });
  }

  // ── 4. Refund / chargeback / cancelamento ─────────────────────────────────
  if (['order_refunded', 'order_chargeback', 'subscription_cancelled', 'subscription_expired'].includes(event ?? '')) {
    if (!user) {
      await supabase.from('cadastros_pendentes').delete().eq('email', email).eq('usado', false);
      return NextResponse.json({ ok: true, action: 'pendencia_removida' });
    }
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, subscription_status: 'expirado' },
    });
    await supabase.from('assinaturas').upsert({
      user_id:        user.id,
      status:         'expirado',
      data_expiracao: new Date().toISOString(),
      updated_at:     new Date().toISOString(),
    }, { onConflict: 'user_id' });
    console.log(`[webhook] ❌ Expirado: ${email} | motivo: ${event}`);
    return NextResponse.json({ ok: true, action: 'expirado' });
  }

  // Evento não tratado — responde 200 para Kiwify não retentar
  console.log(`[webhook] ⚪ Ignorado: ${event}`);
  return NextResponse.json({ ok: true, action: 'ignored', event });
}
