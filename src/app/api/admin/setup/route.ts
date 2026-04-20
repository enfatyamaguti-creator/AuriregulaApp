import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASS  = '@Password123';

function getAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST() {
  const supabase = getAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY ausente' }, { status: 500 });
  }

  // Verifica se já existe
  const { data: lista } = await supabase.auth.admin.listUsers();
  const existente = lista?.users?.find(u => u.email === ADMIN_EMAIL);

  if (existente) {
    await supabase.auth.admin.updateUserById(existente.id, {
      user_metadata: { role: 'admin', nome: 'Admin' },
    });
    // Garante linha na tabela profiles se existir
    await supabase.from('profiles').upsert({ id: existente.id, nome: 'Admin', role: 'admin' });
    return NextResponse.json({ message: 'Admin já existe — metadados atualizados.' });
  }

  // Cria o usuário
  const { data, error } = await supabase.auth.admin.createUser({
    email:         ADMIN_EMAIL,
    password:      ADMIN_PASS,
    user_metadata: { role: 'admin', nome: 'Admin' },
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({
      error: error.message,
      solucao: 'Execute o SQL abaixo no Supabase Dashboard → SQL Editor:',
      sql: [
        "CREATE TABLE IF NOT EXISTS public.profiles (",
        "  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,",
        "  nome TEXT, role TEXT DEFAULT 'user',",
        "  created_at TIMESTAMPTZ DEFAULT NOW()",
        ");",
        "ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;",
        "CREATE POLICY \"all\" ON public.profiles USING (true) WITH CHECK (true);",
      ].join('\n'),
    }, { status: 500 });
  }

  // Popula profiles se a tabela existir
  if (data.user?.id) {
    await supabase.from('profiles').upsert({ id: data.user.id, nome: 'Admin', role: 'admin' });
  }

  return NextResponse.json({ success: true, message: 'Admin criado com sucesso!', id: data.user?.id });
}

export async function GET() {
  const supabase = getAdmin();
  if (!supabase) return NextResponse.json({ error: 'Service key ausente' }, { status: 500 });

  const { data: lista } = await supabase.auth.admin.listUsers();
  const admin = lista?.users?.find(u => u.email === ADMIN_EMAIL);

  return NextResponse.json({
    adminExiste:    !!admin,
    adminMetadata:  admin?.user_metadata ?? null,
    totalUsuarios:  lista?.users?.length ?? 0,
    sql_para_rodar: [
      '-- Execute no Supabase Dashboard → SQL Editor:',
      "CREATE TABLE IF NOT EXISTS public.profiles (",
      "  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,",
      "  nome TEXT, role TEXT DEFAULT 'user',",
      "  created_at TIMESTAMPTZ DEFAULT NOW()",
      ");",
      "ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;",
      "CREATE POLICY \"all\" ON public.profiles USING (true) WITH CHECK (true);",
    ].join('\n'),
  });
}
