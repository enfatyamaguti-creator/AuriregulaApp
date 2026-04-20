import { notFound } from 'next/navigation';
import AppHeader from '@/components/Layout/AppHeader';
import ProtoCard from '@/components/ProtoCard/ProtoCard';
import { PROTOCOLOS } from '@/lib/protocolos';

const META_POPULACAO: Record<string, { titulo: string; variante: 'forest' | 'rose' | 'amber' | 'teal'; aviso?: string }> = {
  pediatria:   { titulo: 'Pediatria (0–12)',        variante: 'forest', aviso: 'Adaptar técnica: preferir laser ou semissólio. Sessões curtas. Consentimento dos responsáveis obrigatório.' },
  adolescente: { titulo: 'Adolescentes (12–18)',     variante: 'forest' },
  idoso:       { titulo: 'Idosos (60+)',             variante: 'amber', aviso: 'Verificar anticoagulação antes de agulhas. Preferir semissólio ou laser em idosos frágeis. Comunicar médico assistente.' },
  esporte:     { titulo: 'Atletas e Esporte',        variante: 'amber' },
  gestante:    { titulo: 'Gestantes',               variante: 'rose', aviso: 'CONTRAINDICADOS: pontos Útero, Ovário, Lombossacro, Pélvis. Sempre com liberação obstétrica documentada.' },
  oncologia:      { titulo: 'Oncologia Integrativa',      variante: 'forest', aviso: 'Comunicação com oncologista obrigatória. Uso exclusivo como suporte paliativo à qualidade de vida. Verificar plaquetas antes de agulhas.' },
  emagrecimento:  { titulo: 'Emagrecimento',              variante: 'forest', aviso: 'A auriculoterapia é suporte integrativo. Associar sempre à reeducação alimentar e acompanhamento nutricional/médico.' },
  vicios:         { titulo: 'Vícios e Dependências',      variante: 'amber',  aviso: 'Ferramenta de suporte complementar. Não substitui tratamento psiquiátrico, farmacológico ou grupos de apoio (AA, NA, etc.).' },
  tea:            { titulo: 'TEA e Autismo',              variante: 'teal',   aviso: 'Técnica adaptada ao perfil sensorial: preferir laser de baixa potência ou semissólio. Sessões curtas (10–15min). Acompanhamento multidisciplinar obrigatório. Consentimento dos responsáveis.' },
};

interface Props { params: Promise<{ categoria: string }> }

export default async function PopulacaoPage({ params }: Props) {
  const { categoria } = await params;
  const meta = META_POPULACAO[categoria];
  if (!meta) notFound();

  const protocolos = PROTOCOLOS.filter(p => p.populacao === categoria);

  return (
    <div>
      <AppHeader titulo={meta.titulo} variante={meta.variante} voltar voltarHref="/populacoes" />
      <div className="px-4 py-4 space-y-3">
        {meta.aviso && (
          <div className={categoria === 'gestante' || categoria === 'oncologia' || categoria === 'tea' ? 'aviso-critico' : 'aviso-clinico'}>
            {meta.aviso}
          </div>
        )}

        {protocolos.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-display text-lg" style={{ color: 'var(--gray)' }}>Protocolos em desenvolvimento</p>
            <p className="text-sm mt-1" style={{ color: 'var(--gray-light)' }}>Em breve novos protocolos para esta população</p>
          </div>
        ) : (
          protocolos.map(p => <ProtoCard key={p.id} protocolo={p} />)
        )}
      </div>
    </div>
  );
}
