import AppHeader from '@/components/Layout/AppHeader';
import AvaliacaoClinica from '@/components/Formulario/AvaliacaoClinica';

export default function AvaliacaoPage() {
  return (
    <div>
      <AppHeader
        titulo="Avaliação Clínica"
        subtitulo="Sugestão de protocolo baseada nos sinais"
      />
      <div className="px-4 md:px-8 py-5 md:py-6 w-full max-w-4xl mx-auto">
        <AvaliacaoClinica />
      </div>
    </div>
  );
}
