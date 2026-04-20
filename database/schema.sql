-- ─────────────────────────────────────────────────────────
-- AuriRegula Pro — Schema PostgreSQL (Supabase)
-- Execute este arquivo no SQL Editor do Supabase
-- ─────────────────────────────────────────────────────────

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROTOCOLOS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS protocolos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          VARCHAR(100) UNIQUE NOT NULL,
  nome          VARCHAR(200) NOT NULL,
  categoria     VARCHAR(100) NOT NULL,
  grupo         VARCHAR(50) NOT NULL,
  populacao     VARCHAR(50),
  indicacao     TEXT NOT NULL,
  objetivo      TEXT NOT NULL,
  pontos        JSONB NOT NULL DEFAULT '[]',
  racional      TEXT NOT NULL,
  sinais        JSONB DEFAULT '[]',
  frequencia    TEXT,
  observacoes   TEXT,
  cuidados      TEXT,
  cor_tema      VARCHAR(20) DEFAULT 'forest',
  is_master     BOOLEAN DEFAULT false,
  ativo         BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PONTOS AURICULARES ────────────────────────────────────
CREATE TABLE IF NOT EXISTS pontos_auriculares (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome           VARCHAR(100) UNIQUE NOT NULL,
  zona_anatomica VARCHAR(200),
  descricao      TEXT,
  acao_principal TEXT,
  cor_categoria  VARCHAR(20) NOT NULL, -- main, neuro, endoc, visceral, col, rose
  coordenada_x   DECIMAL(5,2) NOT NULL,
  coordenada_y   DECIMAL(5,2) NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PACIENTES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pacientes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome             VARCHAR(200) NOT NULL,
  idade            INTEGER CHECK (idade > 0 AND idade < 130),
  sexo             VARCHAR(20) CHECK (sexo IN ('Feminino', 'Masculino', 'Outro')),
  telefone         VARCHAR(30),
  queixa_principal TEXT,
  status           VARCHAR(30) DEFAULT 'ativo' CHECK (status IN ('ativo', 'alta', 'pausado', 'manutencao')),
  observacoes      TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SESSÕES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessoes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id         UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  data_sessao         DATE NOT NULL,
  numero_sessao       INTEGER,
  queixa_dia          TEXT,
  protocolo_id        UUID REFERENCES protocolos(id),
  protocolo_nome      VARCHAR(200),
  pontos_usados       JSONB DEFAULT '[]',
  escala_dor          INTEGER CHECK (escala_dor BETWEEN 0 AND 10),
  escala_ansiedade    INTEGER CHECK (escala_ansiedade BETWEEN 0 AND 10),
  qualidade_sono      INTEGER CHECK (qualidade_sono BETWEEN 0 AND 10),
  observacoes         TEXT,
  ajustes             TEXT,
  proximo_retorno     DATE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FAVORITOS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favoritos (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo           VARCHAR(20) NOT NULL CHECK (tipo IN ('protocolo', 'capitulo')),
  referencia_id  VARCHAR(100) NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tipo, referencia_id)
);

-- ─── CAPÍTULOS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS capitulos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero     INTEGER UNIQUE NOT NULL,
  titulo     VARCHAR(200) NOT NULL,
  subtitulo  VARCHAR(300),
  conteudo   TEXT NOT NULL,
  ordem      INTEGER NOT NULL,
  ativo      BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PERFIS DE USUÁRIO ────────────────────────────────────
CREATE TABLE IF NOT EXISTS perfis_usuario (
  id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome      VARCHAR(200),
  perfil    VARCHAR(20) DEFAULT 'aluno' CHECK (perfil IN ('profissional', 'aluno', 'admin')),
  bio       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ÍNDICES ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_protocolos_grupo      ON protocolos(grupo);
CREATE INDEX IF NOT EXISTS idx_protocolos_populacao  ON protocolos(populacao);
CREATE INDEX IF NOT EXISTS idx_protocolos_ativo      ON protocolos(ativo);
CREATE INDEX IF NOT EXISTS idx_sessoes_paciente      ON sessoes(paciente_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_data          ON sessoes(data_sessao);
CREATE INDEX IF NOT EXISTS idx_pacientes_user        ON pacientes(user_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_user        ON favoritos(user_id);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────
ALTER TABLE pacientes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis_usuario  ENABLE ROW LEVEL SECURITY;

-- Policies: usuário acessa apenas seus próprios dados
CREATE POLICY "Pacientes do usuário" ON pacientes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Sessões do usuário" ON sessoes
  FOR ALL USING (
    paciente_id IN (SELECT id FROM pacientes WHERE user_id = auth.uid())
  );

CREATE POLICY "Favoritos do usuário" ON favoritos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Perfil do próprio usuário" ON perfis_usuario
  FOR ALL USING (auth.uid() = id);

-- Protocolos, pontos e capítulos são públicos (leitura)
CREATE POLICY "Protocolos públicos" ON protocolos FOR SELECT USING (true);
CREATE POLICY "Pontos públicos" ON pontos_auriculares FOR SELECT USING (true);
CREATE POLICY "Capítulos públicos" ON capitulos FOR SELECT USING (ativo = true);

-- ─── TRIGGER: updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pacientes_updated_at
  BEFORE UPDATE ON pacientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_protocolos_updated_at
  BEFORE UPDATE ON protocolos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── TRIGGER: criar perfil ao registrar usuário ─────────────
CREATE OR REPLACE FUNCTION criar_perfil_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO perfis_usuario (id, nome, perfil)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nome', 'aluno');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_criar_perfil
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION criar_perfil_usuario();
