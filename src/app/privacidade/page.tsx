import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <header className="px-5 md:px-10 py-4 border-b" style={{ backgroundColor: 'white', borderColor: 'rgba(26,58,42,0.10)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 text-sm" style={{ color: 'var(--forest)' }}>
            <ArrowLeft size={16} />
            AuriRegula Pro
          </Link>
          <p className="text-xs" style={{ color: 'var(--gray)' }}>Política de Privacidade</p>
        </div>
      </header>

      <div className="px-5 md:px-10 py-10 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--charcoal)' }}>Política de Privacidade</h1>
        <p className="text-xs mb-8" style={{ color: 'var(--gray)' }}>Última atualização: janeiro de 2025</p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>1. Dados que coletamos</h2>
            <p style={{ color: 'var(--gray)' }}>
              Coletamos apenas os dados necessários para o funcionamento do serviço: nome, email, dados de acesso e informações de uso da plataforma. Os dados de pacientes inseridos na plataforma são de sua responsabilidade e ficam vinculados à sua conta.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>2. Como usamos seus dados</h2>
            <p style={{ color: 'var(--gray)' }}>
              Seus dados são utilizados exclusivamente para fornecer e melhorar o serviço, processar pagamentos, enviar comunicações relacionadas à conta e cumprir obrigações legais. Não vendemos nem compartilhamos dados pessoais com terceiros para fins comerciais.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>3. Dados de pacientes</h2>
            <p style={{ color: 'var(--gray)' }}>
              Os dados de pacientes registrados na plataforma são de responsabilidade exclusiva do profissional que os inseriu. Recomendamos obter consentimento dos pacientes antes de registrar informações clínicas, em conformidade com a LGPD (Lei Geral de Proteção de Dados).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>4. Segurança</h2>
            <p style={{ color: 'var(--gray)' }}>
              Utilizamos infraestrutura segura (Supabase) com criptografia de dados em trânsito e em repouso. Senhas são armazenadas com hash seguro. Empregamos as melhores práticas de segurança disponíveis para proteger suas informações.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>5. Seus direitos (LGPD)</h2>
            <p style={{ color: 'var(--gray)' }}>
              Você tem direito a: acessar, corrigir ou excluir seus dados pessoais; revogar consentimento; solicitar portabilidade dos dados; e ser informado sobre o tratamento de seus dados. Para exercer esses direitos, entre em contato com nosso suporte.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>6. Retenção de dados</h2>
            <p style={{ color: 'var(--gray)' }}>
              Mantemos seus dados enquanto sua conta estiver ativa. Após o encerramento da conta, os dados são excluídos em até 30 dias, exceto quando há obrigação legal de retenção.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--forest)' }}>7. Contato</h2>
            <p style={{ color: 'var(--gray)' }}>
              Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato pelo email cadastrado ou pelo suporte da plataforma.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t flex gap-4" style={{ borderColor: 'var(--border-card)' }}>
          <Link href="/termos" className="text-sm" style={{ color: 'var(--forest)' }}>
            Termos de Uso →
          </Link>
          <Link href="/login" className="text-sm" style={{ color: 'var(--gray)' }}>
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
