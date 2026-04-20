-- ─────────────────────────────────────────────────────────
-- AuriRegula Pro — Seed: 34 Pontos Auriculares
-- Coordenadas calibradas via referência ZhenMed (orelha direita, frontal)
-- Execute após schema.sql
-- ─────────────────────────────────────────────────────────

INSERT INTO pontos_auriculares (nome, zona_anatomica, cor_categoria, coordenada_x, coordenada_y) VALUES
  -- Regulatório Central (main)
  ('Shenmen',              'Fossa triangular',                  'main',     62, 22),
  ('Subcórtex',            'Antitrago interno',                 'main',     40, 68),
  ('Simpático',            'Anti-hélix — junção inferior',      'main',     66, 53),
  ('Analgesia',            'Lóbulo — ponto central',            'main',     38, 83),
  ('Nervo Vago',           'Concha cimba — zona central',       'main',     50, 50),
  -- Neuromodulador (neuro)
  ('Coração',              'Concha cimba — zona vagal',         'neuro',    47, 52),
  ('Ansiedade',            'Fossa triangular superior',         'neuro',    67, 17),
  ('Occipital',            'Antitrago externo posterior',       'neuro',    30, 72),
  ('Temporal',             'Hélice — junção com antitrago',    'neuro',    25, 67),
  ('Tálamo',               'Antitrago superior',                'neuro',    40, 65),
  ('Sono',                 'Fossa triangular interna',          'neuro',    57, 26),
  -- Neuroendócrino (endoc)
  ('Endócrino',            'Incisura intertrágo — interno',     'endoc',    24, 62),
  ('Hipotálamo',           'Antitrago central',                 'endoc',    37, 70),
  ('Hipófise',             'Lóbulo superior interno',           'endoc',    33, 78),
  ('Glândula Suprarrenal', 'Trago inferior',                    'endoc',    20, 58),
  ('Fome',                 'Trago inferior lateral',            'endoc',    22, 57),
  ('Tireóide',             'Antitrago — borda inferior',        'endoc',    35, 74),
  -- Visceral / Orgânico (visceral)
  ('Pulmão',               'Concha cimba superior',             'visceral', 46, 47),
  ('Fígado',               'Concha cymba — zona superior',      'visceral', 55, 42),
  ('Baço',                 'Concha cymba lateral',              'visceral', 59, 46),
  ('Estômago',             'Concha cymba inferior',             'visceral', 50, 57),
  ('Intestino Grosso',     'Concha inferior anterior',          'visceral', 57, 62),
  ('Rim',                  'Concha inferior',                   'visceral', 63, 55),
  ('Boca',                 'Trago inferior medial',             'visceral', 18, 54),
  -- Musculoesquelético (col)
  ('Cervical',             'Anti-hélix — terço superior',       'col',      74, 30),
  ('Lombossacro',          'Anti-hélix — terço inferior',       'col',      77, 53),
  ('Torácica',             'Anti-hélix — porção média',         'col',      76, 42),
  ('Quadril',              'Anti-hélix — cauda inferior',       'col',      77, 62),
  ('Ombro',                'Fossa escafoide — superior',        'col',      70, 22),
  ('ATM',                  'Trago anterior superior',           'col',      19, 40),
  ('Masseter',             'Trago anterior inferior',           'col',      17, 50),
  ('Relaxamento Muscular', 'Anti-hélix posterior',              'col',      71, 61),
  -- Saúde Feminina (rose)
  ('Útero',                'Trígono da fossa triangular',       'rose',     64, 28),
  ('Ovário',               'Trígono — borda superior',          'rose',     68, 20)
ON CONFLICT (nome) DO UPDATE SET
  zona_anatomica = EXCLUDED.zona_anatomica,
  coordenada_x   = EXCLUDED.coordenada_x,
  coordenada_y   = EXCLUDED.coordenada_y;
