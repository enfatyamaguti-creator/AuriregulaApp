-- ================================================================
-- AuriRegula Pro — Recriação completa das tabelas
-- Execute no Supabase Dashboard → SQL Editor
-- ================================================================

-- Remove tudo na ordem correta (FK respeita a ordem)
DROP TABLE IF EXISTS public.sessoes       CASCADE;
DROP TABLE IF EXISTS public.agendamentos  CASCADE;
DROP TABLE IF EXISTS public.assinaturas   CASCADE;
DROP TABLE IF EXISTS public.pacientes     CASCADE;

-- ── 1. PACIENTES ─────────────────────────────────────────────────
CREATE TABLE public.pacientes (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome             TEXT NOT NULL,
  idade            INTEGER DEFAULT 0,
  sexo             TEXT DEFAULT 'Feminino',
  telefone         TEXT DEFAULT '',
  queixa_principal TEXT NOT NULL,
  status           TEXT DEFAULT 'ativo',
  proximo_retorno  TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pacientes_select" ON public.pacientes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "pacientes_insert" ON public.pacientes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pacientes_update" ON public.pacientes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "pacientes_delete" ON public.pacientes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "pacientes_admin"  ON public.pacientes FOR ALL USING (
  coalesce((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'admin'
);

-- ── 2. SESSÕES ───────────────────────────────────────────────────
CREATE TABLE public.sessoes (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id        UUID REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL,
  user_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data_sessao        TEXT NOT NULL,
  numero_sessao      INTEGER DEFAULT 1,
  queixa_dia         TEXT DEFAULT '',
  protocolo_id       TEXT DEFAULT '',
  protocolo_nome     TEXT NOT NULL DEFAULT '',
  pontos_usados      TEXT[] DEFAULT '{}',
  escala_dor         INTEGER DEFAULT 0,
  escala_ansiedade   INTEGER DEFAULT 0,
  qualidade_sono     INTEGER DEFAULT 0,
  observacoes        TEXT DEFAULT '',
  ajustes            TEXT DEFAULT '',
  proximo_retorno    TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.sessoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessoes_select" ON public.sessoes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessoes_insert" ON public.sessoes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessoes_update" ON public.sessoes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sessoes_delete" ON public.sessoes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "sessoes_admin"  ON public.sessoes FOR ALL USING (
  coalesce((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'admin'
);

-- ── 3. AGENDAMENTOS ──────────────────────────────────────────────
CREATE TABLE public.agendamentos (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  paciente_nome  TEXT NOT NULL,
  data           TEXT NOT NULL,
  hora           TEXT NOT NULL,
  protocolo      TEXT DEFAULT '',
  observacoes    TEXT DEFAULT '',
  status         TEXT DEFAULT 'agendado',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agendamentos_select" ON public.agendamentos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "agendamentos_insert" ON public.agendamentos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "agendamentos_update" ON public.agendamentos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "agendamentos_delete" ON public.agendamentos FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "agendamentos_admin"  ON public.agendamentos FOR ALL USING (
  coalesce((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'admin'
);

-- ── 4. ASSINATURAS ───────────────────────────────────────────────
CREATE TABLE public.assinaturas (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status           TEXT DEFAULT 'ativo',
  plano            TEXT DEFAULT 'mensal',
  data_inicio      TIMESTAMPTZ DEFAULT NOW(),
  data_expiracao   TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assinaturas_select" ON public.assinaturas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "assinaturas_admin"  ON public.assinaturas FOR ALL USING (
  coalesce((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'admin'
);

-- ── 5. Trigger updated_at ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pacientes_updated_at  BEFORE UPDATE ON public.pacientes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER assinaturas_updated_at BEFORE UPDATE ON public.assinaturas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
