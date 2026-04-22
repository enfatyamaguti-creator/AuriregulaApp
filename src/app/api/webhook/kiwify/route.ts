import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// ── dias de acesso por oferta ──────────────────────────────────────────────
const DIAS_POR_OFERTA: Record<string, number> = {
  [process.env.KIWIFY_OFFER_ID_MENSAL   ?? '']: 31,
  [process.env.KIWIFY_OFFER_ID_ANUAL    ?? '']: 366,
  [process.env.KIWIFY_OFFER_ID_FORMACAO ?? '']: 366,
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

export async function POST(req: NextRequest) {
  // ── 1. Verifica secret ────────────────────────────────────────────────────
  const secret = process.env.KIWIFY_WEBHOOK_SECRET;
  if (secret) {
    const token = req.headers.get('x-kiwify-token') ?? req.headers.get('authorization');
    if (token !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── 2. Parse payload ──────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const event    = body.event as string | undefined;
  const data     = body.data as Record<string, unknown> | undefined;
  const email    = (data?.customer as Record<string, string> | undefined)?.email;
  const offerId  = (data?.product  as Record<string, string> | undefined)?.id;

  if (!email) {
    return NextResponse.json({ error: 'Email ausente no payload' }, { status: 400 });
  }

  // ── 3. Busca usuário no Supabase ──────────────────────────────────────────
  const supabase = adminClient();
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error('[webhook] listUsers:', listErr.message);
    return NextResponse.json({ error: 'Supabase error' }, { status: 500 });
  }

  const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    // Usuário ainda não tem conta — registra pendência para ativar no primeiro login
    console.warn('[webhook] Usuário não encontrado:', email, '| event:', event);
    return NextResponse.json({ warning: 'Usuário não encontrado', email });
  }

  // ── 4. Age conforme o evento ───────────────────────────────────────────────
  if (event === 'order_approved') {
    const dias = (offerId && DIAS_POR_OFERTA[offerId]) ? DIAS_POR_OFERTA[offerId] : 31;
    const expiracao = addDias(dias);

    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, subscription_status: 'ativo' },
    });

    await supabase.from('assinaturas').upsert({
      user_id:        user.id,
      status:         'ativo',
      plano:          offerId ?? 'desconhecido',
      data_expiracao: expiracao,
      updated_at:     new Date().toISOString(),
    }, { onConflict: 'user_id' });

    console.log(`[webhook] ✅ Ativado: ${email} | oferta: ${offerId} | expira: ${expiracao}`);
    return NextResponse.json({ ok: true, action: 'ativado', expiracao });
  }

  if (event === 'order_refunded' || event === 'order_chargeback') {
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
  return NextResponse.json({ ok: true, action: 'ignored', event });
}
