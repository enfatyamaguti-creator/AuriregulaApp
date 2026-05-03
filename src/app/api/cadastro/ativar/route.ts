import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

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
  const { email, nome, senha, opcao } = await req.json() as {
    email: string;
    nome?: string;
    senha?: string;
    opcao: 'nova_conta' | 'manter_conta';
  };

  if (!email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });

  const supabase = adminClient();
  const emailNorm = email.toLowerCase();

  // Busca pendência
  const { data: pendencia } = await supabase
    .from('cadastros_pendentes')
    .select('id, offer_id, dias')
    .eq('email', emailNorm)
    .eq('usado', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!pendencia) {
    return NextResponse.json({ error: 'Ativação não encontrada ou expirada.' }, { status: 400 });
  }

  const expiracao = addDias(pendencia.dias ?? 31);

  if (opcao === 'manter_conta') {
    // Ativa a conta existente
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email?.toLowerCase() === emailNorm);
    if (!user) return NextResponse.json({ error: 'Conta não encontrada.' }, { status: 404 });

    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, subscription_status: 'ativo' },
    });
    await supabase.from('assinaturas').upsert({
      user_id:        user.id,
      status:         'ativo',
      plano:          pendencia.offer_id ?? 'desconhecido',
      data_expiracao: expiracao,
      updated_at:     new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } else {
    // Cria nova conta
    if (!nome?.trim() || !senha) {
      return NextResponse.json({ error: 'Nome e senha obrigatórios.' }, { status: 400 });
    }
    const { data, error } = await supabase.auth.admin.createUser({
      email:         emailNorm,
      password:      senha,
      email_confirm: true,
      user_metadata: { nome: nome.trim(), role: 'user', subscription_status: 'ativo' },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await supabase.from('assinaturas').insert({
      user_id:        data.user.id,
      status:         'ativo',
      plano:          pendencia.offer_id ?? 'desconhecido',
      data_expiracao: expiracao,
    });
  }

  // Marca pendência como usada
  await supabase.from('cadastros_pendentes').update({ usado: true }).eq('id', pendencia.id);

  return NextResponse.json({ ok: true });
}
