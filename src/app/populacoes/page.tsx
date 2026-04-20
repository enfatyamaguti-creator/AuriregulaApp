import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import AppHeader from '@/components/Layout/AppHeader';

const POPULACOES = [
  {
    id: 'pediatria',
    titulo: 'Pediatria (0–12)',
    subtitulo: 'Protocolos para crianças com técnica adaptada',
    cor: '#0f6e56',
    corBg: 'rgba(15,110,86,0.08)',
    emoji: '🧒',
    aviso: 'Preferir laser ou semissólio. Consentimento dos responsáveis obrigatório.',
  },
  {
    id: 'adolescente',
    titulo: 'Adolescentes (12–18)',
    subtitulo: 'Regulação emocional, ansiedade, acne hormonal',
    cor: '#854f0b',
    corBg: 'rgba(133,79,11,0.08)',
    emoji: '🧑',
    aviso: null,
  },
  {
    id: 'idoso',
    titulo: 'Idosos (60+)',
    subtitulo: 'Dor crônica, sono, cognição, equilíbrio',
    cor: '#b8974a',
    corBg: 'rgba(184,151,74,0.08)',
    emoji: '👴',
    aviso: 'Verificar anticoagulação. Adaptar técnica ao estado da pele.',
  },
  {
    id: 'esporte',
    titulo: 'Atletas e Esporte',
    subtitulo: 'Recuperação atlética, performance, tendinopatias',
    cor: '#1a3a2a',
    corBg: 'rgba(26,58,42,0.08)',
    emoji: '🏃',
    aviso: null,
  },
  {
    id: 'gestante',
    titulo: 'Gestantes',
    subtitulo: 'Náusea, lombalgia, ansiedade gestacional',
    cor: '#8b3a52',
    corBg: 'rgba(139,58,82,0.08)',
    emoji: '🤰',
    aviso: 'CONTRAINDICADOS: Útero, Ovário, Lombossacro, Pélvis. Liberação obstétrica obrigatória.',
  },
  {
    id: 'oncologia',
    titulo: 'Oncologia Integrativa',
    subtitulo: 'Suporte paliativo e qualidade de vida',
    cor: '#2d5a42',
    corBg: 'rgba(45,90,66,0.08)',
    emoji: '🌿',
    aviso: 'Comunicação obrigatória com oncologista. Apenas suporte paliativo.',
  },
  {
    id: 'emagrecimento',
    titulo: 'Emagrecimento',
    subtitulo: 'Regulação metabólica, apetite e composição corporal',
    cor: '#0f6e56',
    corBg: 'rgba(15,110,86,0.08)',
    emoji: '⚖️',
    aviso: null,
  },
  {
    id: 'vicios',
    titulo: 'Vícios e Dependências',
    subtitulo: 'Cessação, controle do craving e síndrome de abstinência',
    cor: '#854f0b',
    corBg: 'rgba(133,79,11,0.08)',
    emoji: '🔓',
    aviso: 'Suporte complementar. Não substitui tratamento psiquiátrico ou grupos terapêuticos.',
  },
  {
    id: 'tea',
    titulo: 'TEA e Autismo',
    subtitulo: 'Regulação sensorial, comportamental e do sono no espectro autista',
    cor: '#185FA5',
    corBg: 'rgba(24,95,165,0.08)',
    emoji: '🧩',
    aviso: 'Técnica adaptada: preferir laser ou semissólio. Consentimento e acompanhamento multidisciplinar obrigatórios.',
  },
];

export default function PopulacoesPage() {
  return (
    <div>
      <AppHeader
        titulo="Populações Especiais"
        subtitulo="Protocolos adaptados por faixa etária e condição"
      />

      <div className="px-4 py-4 space-y-3">
        <div className="aviso-clinico">
          Protocolos para populações especiais exigem adaptação da técnica, dosagem do estímulo e avaliação individualizada.
          Considere as particularidades fisiológicas de cada grupo.
        </div>

        {POPULACOES.map(({ id, titulo, subtitulo, cor, corBg, emoji, aviso }) => (
          <Link key={id} href={`/populacoes/${id}`} className="block">
            <div
              className="rounded-[14px] p-4 transition-all active:scale-[0.98]"
              style={{ backgroundColor: 'white', border: `1px solid ${cor}30`, boxShadow: 'var(--shadow)' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>{titulo}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--gray)' }}>{subtitulo}</p>
                  {aviso && (
                    <div className="mt-2 flex items-start gap-1.5">
                      <AlertTriangle size={11} style={{ color: cor, flexShrink: 0, marginTop: 1 }} />
                      <p className="text-[11px] leading-tight" style={{ color: cor }}>{aviso}</p>
                    </div>
                  )}
                </div>
                <span style={{ color: cor }}>›</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
