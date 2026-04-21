-- ================================================================
-- AuriRegula Pro — Correção de políticas RLS
-- Execute no Supabase Dashboard → SQL Editor se pacientes/agendamentos
-- não estiverem salvando
-- ================================================================

-- Verifica se as tabelas existem
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('pacientes','sessoes','agendamentos','assinaturas');

-- ── Recriar políticas de INSERT explícitas ──────────────────────
-- (algumas versões do Supabase exigem políticas separadas por operação)

-- PACIENTES
DROP POLICY IF EXISTS "pacientes_own"   ON public.pacientes;
DROP POLICY IF EXISTS "pacientes_admin" ON public.pacientes;

CREATE POLICY "pacientes_select" ON public.pacientes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "pacientes_insert" ON public.pacientes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pacientes_update" ON public.pacientes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "pacientes_delete" ON public.pacientes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "pacientes_admin"  ON public.pacientes FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- SESSÕES
DROP POLICY IF EXISTS "sessoes_own"   ON public.sessoes;
DROP POLICY IF EXISTS "sessoes_admin" ON public.sessoes;

CREATE POLICY "sessoes_select" ON public.sessoes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessoes_insert" ON public.sessoes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessoes_update" ON public.sessoes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sessoes_delete" ON public.sessoes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "sessoes_admin"  ON public.sessoes FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- AGENDAMENTOS
DROP POLICY IF EXISTS "agendamentos_own"   ON public.agendamentos;
DROP POLICY IF EXISTS "agendamentos_admin" ON public.agendamentos;

CREATE POLICY "agendamentos_select" ON public.agendamentos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "agendamentos_insert" ON public.agendamentos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "agendamentos_update" ON public.agendamentos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "agendamentos_delete" ON public.agendamentos FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "agendamentos_admin"  ON public.agendamentos FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);
