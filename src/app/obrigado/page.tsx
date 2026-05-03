import Link from 'next/link';
import Image from 'next/image';
import { Mail, CheckCircle } from 'lucide-react';

export default function ObrigadoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16"
      style={{ backgroundColor: 'var(--cream)' }}>

      <div className="max-w-md w-full text-center space-y-6">

        <Link href="/" className="flex items-center justify-center gap-3 mb-2">
          <Image
            src="/images/AuriRegulaLogo.jpeg"
            alt="AuriRegula Pro"
            width={48}
            height={48}
            className="rounded-[10px] object-cover"
          />
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--forest)' }}>
            AuriRegula Pro
          </h1>
        </Link>

        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: 'rgba(26,58,42,0.10)' }}>
          <CheckCircle size={38} style={{ color: 'var(--forest)' }} />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: 'var(--charcoal)' }}>
            Compra confirmada!
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--gray)' }}>
            Obrigado pela sua assinatura do AuriRegula Pro.
          </p>
        </div>

        <div className="p-5 rounded-[16px] text-left space-y-3"
          style={{ backgroundColor: 'white', boxShadow: 'var(--shadow)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(184,151,74,0.12)' }}>
              <Mail size={18} style={{ color: 'var(--gold)' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>
                Verifique seu email
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--gray)' }}>
                Enviamos um link para você criar sua conta e acessar o app. O link é válido por 48 horas.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs" style={{ color: 'var(--gray-light)' }}>
          Não recebeu o email? Verifique a caixa de spam ou{' '}
          <Link href="/login" style={{ color: 'var(--forest)' }} className="underline">
            entre em contato
          </Link>.
        </p>

      </div>
    </div>
  );
}
