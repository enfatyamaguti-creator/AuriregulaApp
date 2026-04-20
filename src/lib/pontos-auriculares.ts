import type { PontoAuricular } from '@/types';

// Coordenadas calibradas via /admin/calibrar (px/py = % da imagem, 0–100)
export const PONTOS_AURICULARES: Record<string, PontoAuricular> = {
  'Shenmen':                 { nome: 'Shenmen',                 px: 51, py: 28, zona: 'Fossa triangular', cor: 'main' },
  'Subcórtex':               { nome: 'Subcórtex',               px: 70, py: 66, zona: 'Antitrago interno', cor: 'main' },
  'Simpático':               { nome: 'Simpático',               px: 65, py: 25, zona: 'Anti-hélix — junção inferior', cor: 'main' },
  'Analgesia':               { nome: 'Analgesia',               px: 51, py: 48, zona: 'Lóbulo — ponto central', cor: 'main' },
  'Nervo Vago':              { nome: 'Nervo Vago',              px: 60, py: 54, zona: 'Concha cymba — zona central', cor: 'main' },
  'Coração':                 { nome: 'Coração',                 px: 67, py: 51, zona: 'Concha cymba — zona vagal', cor: 'neuro' },
  'Ansiedade':               { nome: 'Ansiedade',               px: 53, py: 70, zona: 'Fossa triangular superior', cor: 'neuro' },
  'Occipital':               { nome: 'Occipital',               px: 56, py: 63, zona: 'Antitrago externo posterior', cor: 'neuro' },
  'Temporal':                { nome: 'Temporal',                px: 59, py: 66, zona: 'Hélice — junção com antitrago', cor: 'neuro' },
  'Tálamo':                  { nome: 'Tálamo',                  px: 63, py: 61, zona: 'Antitrago superior', cor: 'neuro' },
  'Sono':                    { nome: 'Sono',                    px: 43, py: 72, zona: 'Fossa triangular interna', cor: 'neuro' },
  'Endócrino':               { nome: 'Endócrino',               px: 76, py: 66, zona: 'Incisura intertrágo — interno', cor: 'endoc' },
  'Hipotálamo':              { nome: 'Hipotálamo',              px: 54, py: 60, zona: 'Antitrago central', cor: 'endoc' },
  'Hipófise':                { nome: 'Hipófise',                px: 59, py: 58, zona: 'Lóbulo superior interno', cor: 'endoc' },
  'Glândula Suprarrenal':    { nome: 'Glândula Suprarrenal',    px: 72, py: 49, zona: 'Trago inferior', cor: 'endoc' },
  'Fome':                    { nome: 'Fome',                    px: 75, py: 48, zona: 'Trago inferior lateral', cor: 'endoc' },
  'Tireóide':                { nome: 'Tireóide',                px: 47, py: 63, zona: 'Antitrago — borda inferior', cor: 'endoc' },
  'Pulmão':                  { nome: 'Pulmão',                  px: 68, py: 56, zona: 'Concha cymba superior', cor: 'visceral' },
  'Fígado':                  { nome: 'Fígado',                  px: 51, py: 41, zona: 'Concha cymba — zona superior', cor: 'visceral' },
  'Baço':                    { nome: 'Baço',                    px: 52, py: 38, zona: 'Concha cymba lateral', cor: 'visceral' },
  'Estômago':                { nome: 'Estômago',                px: 55, py: 44, zona: 'Concha cymba inferior', cor: 'visceral' },
  'Intestino Grosso':        { nome: 'Intestino Grosso',        px: 61, py: 34, zona: 'Concha inferior anterior', cor: 'visceral' },
  'Rim':                     { nome: 'Rim',                     px: 56, py: 35, zona: 'Concha inferior', cor: 'visceral' },
  'Boca':                    { nome: 'Boca',                    px: 65, py: 43, zona: 'Trago inferior medial', cor: 'visceral' },
  'Cervical':                { nome: 'Cervical',                px: 47, py: 50, zona: 'Anti-hélix — terço superior', cor: 'col' },
  'Lombossacro':             { nome: 'Lombossacro',             px: 49, py: 37, zona: 'Anti-hélix — terço inferior', cor: 'col' },
  'Torácica':                { nome: 'Torácica',                px: 47, py: 42, zona: 'Anti-hélix — porção média', cor: 'col' },
  'Quadril':                 { nome: 'Quadril',                 px: 51, py: 25, zona: 'Anti-hélix — cauda inferior', cor: 'col' },
  'Ombro':                   { nome: 'Ombro',                   px: 40, py: 50, zona: 'Fossa escafoide — superior', cor: 'col' },
  'ATM':                     { nome: 'ATM',                     px: 48, py: 65, zona: 'Trago anterior superior', cor: 'col' },
  'Masseter':                { nome: 'Masseter',                px: 45, py: 61, zona: 'Trago anterior inferior', cor: 'col' },
  'Relaxamento Muscular':    { nome: 'Relaxamento Muscular',    px: 50, py: 48, zona: 'Anti-hélix posterior', cor: 'col' },
  'Útero':                   { nome: 'Útero',                   px: 62, py: 16, zona: 'Trígono da fossa triangular', cor: 'rose' },
  'Ovário':                  { nome: 'Ovário',                  px: 72, py: 64, zona: 'Trígono — borda superior', cor: 'rose' },
  'Intestino Delgado':       { nome: 'Intestino Delgado',       px: 57, py: 39, zona: 'Concha inferior medial', cor: 'visceral' },
  'Pâncreas':                { nome: 'Pâncreas',                px: 51, py: 41, zona: 'Concha cymba — zona central', cor: 'visceral' },
  'Joelho':                  { nome: 'Joelho',                  px: 54, py: 20, zona: 'Fossa escafoide — inferior', cor: 'col' },
  'Lombar':                  { nome: 'Lombar',                  px: 51, py: 35, zona: 'Anti-hélix — terço inferior', cor: 'col' },
  'Mão':                     { nome: 'Mão',                     px: 42, py: 22, zona: 'Fossa escafoide — superior', cor: 'col' },
  'Punho':                   { nome: 'Punho',                   px: 40, py: 29, zona: 'Fossa escafoide — medial', cor: 'col' },
  'Cabeça':                  { nome: 'Cabeça',                  px: 58, py: 70, zona: 'Antitrago — borda inferior', cor: 'neuro' },
  'Tronco Cerebral':         { nome: 'Tronco Cerebral',         px: 29, py: 25, zona: 'Antitrago — zona central', cor: 'neuro' },
  'Ponto da queixa principal': { nome: 'Ponto da queixa principal', px: 50, py: 30, zona: 'Lóbulo — definido na avaliação', cor: 'main' },
};

export const CORES_PONTOS: Record<string, string> = {
  main: '#1a3a2a', neuro: '#185FA5', endoc: '#854f0b',
  visceral: '#0f6e56', col: '#5F5E5A', rose: '#8b3a52',
};

export const LABELS_CORES: Record<string, string> = {
  main: 'Regulatório Central', neuro: 'Neuromodulador', endoc: 'Neuroendócrino',
  visceral: 'Visceral / Orgânico', col: 'Musculoesquelético', rose: 'Saúde Feminina',
};

export function getPontosDosNomes(nomes: string[]): PontoAuricular[] {
  return nomes.map(n => PONTOS_AURICULARES[n]).filter(Boolean);
}
