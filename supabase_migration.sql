-- ================================================================
-- AuriRegula Pro — Migração completa do banco de dados
-- Execute no Supabase Dashboard → SQL Editor
-- ================================================================

-- 1. PACIENTES
CREATE TABLE IF NOT EXISTS public.pacientes (
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
CREATE POLICY "pacientes_own"   ON public.pacientes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "pacientes_admin" ON public.pacientes FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- 2. SESSÕES
CREATE TABLE IF NOT EXISTS public.sessoes (
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
CREATE POLICY "sessoes_own"   ON public.sessoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "sessoes_admin" ON public.sessoes FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- 3. AGENDAMENTOS
CREATE TABLE IF NOT EXISTS public.agendamentos (
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
CREATE POLICY "agendamentos_own"   ON public.agendamentos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "agendamentos_admin" ON public.agendamentos FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- 4. ASSINATURAS
CREATE TABLE IF NOT EXISTS public.assinaturas (
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
CREATE POLICY "assinaturas_own"   ON public.assinaturas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "assinaturas_admin" ON public.assinaturas FOR ALL USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- 5. Função updated_at automático
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pacientes_updated_at BEFORE UPDATE ON public.pacientes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER assinaturas_updated_at BEFORE UPDATE ON public.assinaturas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
