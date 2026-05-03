import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const DIAS_POR_FREQUENCIA: Record<string, number> = {
  monthly: 31,
  yearly:  366,
  weekly:  7,
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

// ── Email de boas-vindas ──────────────────────────────────────────────────────
async function enviarEmailCadastro(email: string, plano: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn('[webhook] RESEND_API_KEY não configurado'); return; }

  const resend   = new Resend(apiKey);
  const from     = process.env.RESEND_FROM ?? 'AuriRegula Pro <noreply@auriregula.com.br>';
  const appUrl   = process.env.NEXT_PUBLIC_APP_URL ?? 'https://auriregula.com.br';
  const link     = `${appUrl}/cadastro?email=${encodeURIComponent(email)}`;

  const { error } = await resend.emails.send({
    from,
    to:      email,
    subject: '✅ Seu acesso ao AuriRegula Pro está pronto!',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <div style="text-align:center;margin-bottom:32px">
          <h1 style="font-size:24px;font-weight:700;color:#1a3a2a;margin:0">AuriRegula Pro</h1>
          <p style="font-size:12px;color:#888;margin:4px 0 0">Método R.E.G.U.L.A.®</p>
        </div>

        <h2 style="font-size:20px;font-weight:700;margin:0 0 8px">Bem-vindo! Seu acesso está confirmado 🎉</h2>
        <p style="color:#555;line-height:1.6;margin:0 0 24px">
          Sua assinatura do plano <strong>${plano}</strong> foi aprovada com sucesso.
          Clique no botão abaixo para criar sua conta e começar a usar o app.
        </p>

        <div style="text-align:center;margin:32px 0">
          <a href="${link}"
            style="background:#1a3a2a;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
            Criar minha conta
          </a>
        </div>

        <p style="font-size:12px;color:#aaa;text-align:center;margin:24px 0 0">
          Este link é válido por 48 horas. Se não solicitou esta compra, ignore este email.
        </p>
        <p style="font-size:12px;color:#ccc;text-align:center;margin:4px 0 0">
          Ou acesse: <a href="${link}" style="color:#1a3a2a">${link}</a>
        </p>
      </div>
    `,
  });

  if (error) console.error('[webhook] Erro ao enviar email:', error);
  else console.log(`[webhook] 📧 Email enviado para: ${email}`);
}

// ── GET — diagnóstico (protegido pelo mesmo token) ────────────────────────────
export async function GET(req: NextRequest) {
  const secret = process.env.KIWIFY_WEBHOOK_SECRET;
  const token  = req.nextUrl.searchParams.get('token');
  if (secret && token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = req.nextUrl.searchParams.get('email');
  const supabase = adminClient();

  // Verifica variáveis de ambiente
  const config = {
    supabase_url:     !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    webhook_secret:   !!process.env.KIWIFY_WEBHOOK_SECRET,
  };

  if (!email) {
    // Retorna pendências recentes
    const { data: pendencias } = await supabase
      .from('cadastros_pendentes')
      .select('email, offer_id, dias, usado, created_at, expires_at')
      .order('created_at', { ascending: false })
      .limit(10);
    return NextResponse.json({ config, pendencias_recentes: pendencias ?? [] });
  }

  // Verifica usuário específico
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

  const { data: assinatura } = await supabase
    .from('assinaturas')
    .select('*')
    .eq('user_id', user?.id ?? '')
    .single();

  const { data: pendencia } = await supabase
    .from('cadastros_pendentes')
    .select('*')
    .eq('email', email.toLowerCase())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({
    config,
    usuario: user ? {
      id:                  user.id,
      email:               user.email,
      subscription_status: user.user_metadata?.subscription_status,
    } : null,
    assinatura: assinatura ?? null,
    pendencia:  pendencia  ?? null,
  });
}

// ── POST — recebe webhook da Kiwify ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  console.log('[webhook] ── Requisição recebida ──');

  try {
    // ── 1. Valida token ───────────────────────────────────────────────────────
    const secret = process.env.KIWIFY_WEBHOOK_SECRET;
    console.log('[webhook] Secret configurado:', !!secret);
    if (secret) {
      const token = req.nextUrl.searchParams.get('token');
      console.log('[webhook] Token recebido:', token ? '✓' : '✗ ausente');
      if (token !== secret) {
        console.warn('[webhook] Token inválido');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // ── 2. Parse payload ──────────────────────────────────────────────────────
    let body: Record<string, unknown>;
    try { body = await req.json(); }
    catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

    const event     = body.webhook_event_type as string | undefined;
    const customer  = body.Customer as Record<string, string> | undefined;
    const sub       = body.Subscription as Record<string, unknown> | undefined;
    const plan      = sub?.plan as Record<string, unknown> | undefined;

    const email     = customer?.email?.toLowerCase();
    const frequency = (plan?.frequency as string | undefined) ?? 'monthly';
    const planName  = (plan?.name as string | undefined) ?? frequency;
    const dias      = DIAS_POR_FREQUENCIA[frequency] ?? 31;

    console.log(`[webhook] event=${event} | email=${email} | frequency=${frequency}`);

    if (!email) return NextResponse.json({ error: 'Email ausente no payload' }, { status: 400 });

    const supabase = adminClient();
    const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) {
      console.error('[webhook] Erro ao listar usuários:', listErr.message);
      return NextResponse.json({ error: 'Supabase error' }, { status: 500 });
    }
    console.log(`[webhook] Total usuários: ${users.length}`);

    const user = users.find(u => u.email?.toLowerCase() === email);

    // ── 3. order_approved ─────────────────────────────────────────────────────
    if (event === 'order_approved') {
      if (user) {
        const expiracao = await ativarAssinatura(supabase, user.id, user.user_metadata ?? {}, planName, dias);
        console.log(`[webhook] ✅ Reativado: ${email} | plano: ${planName} | expira: ${expiracao}`);
        return NextResponse.json({ ok: true, action: 'reativado', expiracao });
      }
      await supabase.from('cadastros_pendentes').insert({ email, offer_id: planName, dias });
      console.log(`[webhook] 🕐 Pendência criada: ${email} | plano: ${planName}`);
      await enviarEmailCadastro(email, planName);
      return NextResponse.json({ ok: true, action: 'pendente_cadastro', email });
    }

    // ── 4. Refund / chargeback / cancelamento ─────────────────────────────────
    if (['order_refunded', 'order_chargeback', 'subscription_canceled', 'subscription_cancelled', 'subscription_expired'].includes(event ?? '')) {
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

    console.log(`[webhook] ⚪ Ignorado: ${event}`);
    return NextResponse.json({ ok: true, action: 'ignored', event });

  } catch (err) {
    console.error('[webhook] ERRO INESPERADO:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
