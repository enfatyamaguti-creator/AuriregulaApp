import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase();
  if (!email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });

  const supabase = adminClient();

  // Verifica pendência válida (não usada e não expirada)
  const { data: pendencia } = await supabase
    .from('cadastros_pendentes')
    .select('id, dias')
    .eq('email', email)
    .eq('usado', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!pendencia) {
    return NextResponse.json({ autorizado: false });
  }

  // Verifica se já tem conta
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const emailExiste = users.some(u => u.email?.toLowerCase() === email);

  return NextResponse.json({ autorizado: true, emailExiste, dias: pendencia.dias });
}
