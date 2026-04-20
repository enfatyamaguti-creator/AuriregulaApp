import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <header className="px-5 md:px-10 py-4 border-b" style={{ backgroundColor: 'white', borderColor: 'rgba(26,58,42,0.10)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 text-sm" style={{ color: 'var(--forest)' }}>
            <ArrowLeft size={16} />
            AuriRegula Pro
          </Link>
          <p className="text-xs" style={{ color: 'var(--gray)' }}>Termos de Uso</p>
        </div>
      </header>

      <div className="px-5 md:px-10 py-10 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--charcoal)' }}>Termos de Uso</h1>
        <p className="text-xs mb-8" style={{ color: 'var(--gray)' }}>Última atualização: janeiro de 2025</p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>1. Aceitação dos termos</h2>
            <p style={{ color: 'var(--gray)' }}>
              Ao utilizar o AuriRegula Pro, você concorda com estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>2. Descrição do serviço</h2>
            <p style={{ color: 'var(--gray)' }}>
              O AuriRegula Pro é uma plataforma digital de suporte clínico para auriculoterapeutes, baseada no Método R.E.G.U.L.A.®. Os protocolos e conteúdos disponibilizados têm caráter educativo e de apoio clínico, não substituindo formação profissional ou consulta médica.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>3. Conta e acesso</h2>
            <p style={{ color: 'var(--gray)' }}>
              O acesso à plataforma é pessoal e intransferível. Você é responsável pela segurança de sua senha e por todas as atividades realizadas em sua conta. Notifique-nos imediatamente em caso de uso não autorizado.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>4. Assinatura e pagamento</h2>
            <p style={{ color: 'var(--gray)' }}>
              O serviço é disponibilizado mediante assinatura paga. Os valores e condições são apresentados no momento da contratação. Oferecemos garantia de 7 dias para reembolso total, sem perguntas, a partir da data da primeira assinatura.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>5. Propriedade intelectual</h2>
            <p style={{ color: 'var(--gray)' }}>
              Todo o conteúdo da plataforma, incluindo o Método R.E.G.U.L.A.®, protocolos clínicos, textos e imagens, é de propriedade exclusiva da AuriRegula Pro e protegido por direitos autorais. É vedada a reprodução, distribuição ou uso comercial sem autorização expressa.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>6. Limitação de responsabilidade</h2>
            <p style={{ color: 'var(--gray)' }}>
              O AuriRegula Pro não se responsabiliza por resultados clínicos decorrentes da aplicação dos protocolos. A responsabilidade pelo atendimento e tomada de decisão clínica é exclusivamente do profissional habilitado.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>7. Contato</h2>
            <p style={{ color: 'var(--gray)' }}>
              Para dúvidas sobre estes termos, entre em contato pelo email informado no momento do cadastro ou pelo suporte da plataforma.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t flex gap-4" style={{ borderColor: 'var(--border-card)' }}>
          <Link href="/privacidade" className="text-sm" style={{ color: 'var(--forest)' }}>
            Política de Privacidade →
          </Link>
          <Link href="/login" className="text-sm" style={{ color: 'var(--gray)' }}>
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
