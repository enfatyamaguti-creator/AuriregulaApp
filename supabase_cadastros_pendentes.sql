-- ================================================================
-- AuriRegula Pro — Tabela de ativações pendentes (pós-Kiwify)
-- Execute no Supabase Dashboard → SQL Editor
-- ================================================================

CREATE TABLE IF NOT EXISTS public.cadastros_pendentes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT NOT NULL,
  offer_id   TEXT,
  dias       INTEGER DEFAULT 31,
  usado      BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 hours'
);

-- Sem RLS — acesso somente via service role (server-side)
ALTER TABLE public.cadastros_pendentes DISABLE ROW LEVEL SECURITY;
