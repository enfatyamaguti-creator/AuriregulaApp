'use client';

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CheckCircle, Star, BookOpen, ClipboardList, Users, CalendarDays, Heart, GraduationCap, Stethoscope, Leaf, ChevronDown } from 'lucide-react';

const PLANOS = [
  {
    id: 'mensal',
    nome: 'Mensal',
    preco: 'R$ 19,90',
    periodo: '/mês',
    detalhe: null,
    destaque: false,
    items: ['Acesso completo a todos os protocolos', 'Gestão de pacientes e prontuários', 'Agenda de sessões', 'Suporte por email'],
  },
  {
    id: 'anual',
    nome: 'Anual',
    preco: 'R$ 97,90',
    periodo: '/ano',
    detalhe: 'R$ 8,16/mês · Economia de 59%',
    destaque: true,
    items: ['Tudo do plano mensal', 'Atualizações de protocolos incluídas', 'Novos módulos em primeira mão', 'Suporte prioritário'],
  },
];

const RECURSOS = [
  { icon: Star,          titulo: 'Protocolo Master R.E.G.U.L.A.®',  desc: 'Base neurofisiológica de todos os protocolos'       },
  { icon: BookOpen,      titulo: '100+ Protocolos Clínicos',          desc: 'Organizados por queixa, grupo e população'          },
  { icon: ClipboardList, titulo: 'Avaliação Guiada',                   desc: 'Sugestão inteligente de protocolo por sintomas'      },
  { icon: Users,         titulo: 'Gestão de Pacientes',               desc: 'Prontuários digitais com evolução clínica'           },
  { icon: CalendarDays,  titulo: 'Agenda Integrada',                   desc: 'Agendamento e controle de sessões'                   },
  { icon: Heart,         titulo: 'Módulos Especializados',            desc: 'Saúde da mulher, pediatria, idosos e mais'           },
];

const FAQS = [
  {
    pergunta: 'O que é o Método R.E.G.U.L.A.®?',
    resposta: 'É um sistema clínico de auriculoterapia baseado no raciocínio neurofisiológico, desenvolvido para tratar a causa da desregulação do organismo — e não apenas os sintomas. Cada letra do acrônimo representa um pilar do método: Regulação, Equilíbrio, Gestão, Unificação, Liberação e Ativação.',
  },
  {
    pergunta: 'Preciso ter formação em auriculoterapia para usar a plataforma?',
    resposta: 'Sim. O AuriRegula Pro é uma ferramenta de suporte clínico para profissionais já formados ou em formação em auriculoterapia. Os protocolos e conteúdos pressupõem conhecimento técnico prévio da prática.',
  },
  {
    pergunta: 'Como funciona a garantia de 7 dias?',
    resposta: 'Se por qualquer motivo você não estiver satisfeito com a plataforma nos primeiros 7 dias após a assinatura, devolvemos 100% do valor pago, sem perguntas. Basta entrar em contato com nosso suporte.',
  },
  {
    pergunta: 'Posso cancelar minha assinatura a qualquer momento?',
    resposta: 'Sim. Você pode cancelar quando quiser. Após o cancelamento, seu acesso permanece ativo até o fim do período contratado. Não fazemos cobranças adicionais.',
  },
  {
    pergunta: 'Os dados dos meus pacientes ficam seguros?',
    resposta: 'Sim. Utilizamos infraestrutura segura com criptografia de dados em trânsito e em repouso. Os dados dos seus pacientes são vinculados exclusivamente à sua conta e não são acessados por terceiros.',
  },
  {
    pergunta: 'A plataforma recebe atualizações com novos protocolos?',
    resposta: 'Sim. O banco de protocolos é atualizado continuamente. Assinantes dos planos semestral e anual recebem as atualizações automaticamente, incluindo novos módulos e conteúdos clínicos.',
  },
];

function FaqItem({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div
      className="border-b last:border-0 py-4 cursor-pointer"
      style={{ borderColor: 'var(--border-card)' }}
      onClick={() => setAberto(v => !v)}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{pergunta}</p>
        <ChevronDown
          size={18}
          className="flex-shrink-0 mt-0.5 transition-transform duration-200"
          style={{ color: 'var(--forest)', transform: aberto ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>
      {aberto && (
        <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--gray)' }}>{resposta}</p>
      )}
    </div>
  );
}

function FaqSection() {
  return (
    <section className="px-5 md:px-12 py-14 md:py-16" style={{ backgroundColor: 'white' }}>
      <div className="max-w-3xl mx-auto">
        <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: 'var(--charcoal)' }}>
          Perguntas frequentes
        </h3>
        <p className="text-sm text-center mb-10" style={{ color: 'var(--gray)' }}>
          Tire suas dúvidas antes de assinar
        </p>
        <div className="card p-4 md:p-6">
          {FAQS.map(f => <FaqItem key={f.pergunta} pergunta={f.pergunta} resposta={f.resposta} />)}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 md:px-12 py-3 border-b" style={{ backgroundColor: 'white', borderColor: 'rgba(26,58,42,0.10)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/AuriRegulaLogo.jpeg"
            alt="AuriRegula Pro"
            width={44}
            height={44}
            className="rounded-[10px] object-cover"
          />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest leading-none" style={{ color: 'var(--gray)' }}>Método R.E.G.U.L.A.®</p>
            <h1 className="font-display text-lg font-bold leading-tight" style={{ color: 'var(--forest)' }}>AuriRegula Pro</h1>
          </div>
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 rounded-[10px] text-sm font-semibold transition-all active:scale-95"
          style={{ backgroundColor: 'var(--forest)', color: 'white' }}
        >
          Entrar
        </Link>
      </nav>

      {/* Hero */}
      <section
        className="px-5 md:px-12 pt-14 pb-16 md:pt-20 md:pb-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'var(--gold)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-8"
          style={{ background: 'var(--gold)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5"
            style={{ backgroundColor: 'rgba(184,151,74,0.20)', color: 'var(--gold)', border: '1px solid rgba(184,151,74,0.35)' }}
          >
            Plataforma clínica para auriculoterapeutos
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            Auriculoterapia Clínica <br className="hidden md:block" />
            Baseada em Evidências
          </h2>
          <p className="text-base md:text-lg mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
            O Método R.E.G.U.L.A.® transforma sua prática clínica com protocolos neurofisiológicos validados, gestão de pacientes e ferramentas de evolução.
          </p>
          <div className="mt-6 p-4 rounded-[14px] max-w-lg mx-auto mb-8" style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderLeft: '3px solid var(--gold)' }}>
            <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.90)' }}>
              "Seu corpo não está apenas doente. Muitas vezes, ele está desregulado."
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[12px] text-sm font-bold transition-all active:scale-95"
            style={{ backgroundColor: 'var(--gold)', color: 'white', boxShadow: '0 4px 20px rgba(184,151,74,0.40)' }}
          >
            Começar agora
          </Link>
          <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.50)' }}>
            Garantia de 7 dias · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Recursos */}
      <section className="px-5 md:px-12 py-14 md:py-16 max-w-5xl mx-auto">
        <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: 'var(--charcoal)' }}>
          Tudo que você precisa na prática clínica
        </h3>
        <p className="text-sm text-center mb-10" style={{ color: 'var(--gray)' }}>
          Recursos desenvolvidos especialmente para auriculoterapeutos
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECURSOS.map(({ icon: Icon, titulo, desc }) => (
            <div key={titulo} className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(26,58,42,0.08)' }}>
                <Icon size={18} style={{ color: 'var(--forest)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--charcoal)' }}>{titulo}</p>
                <p className="text-xs" style={{ color: 'var(--gray)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section className="px-5 md:px-12 py-14 md:py-16" style={{ backgroundColor: 'white' }}>
        <div className="max-w-5xl mx-auto">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: 'var(--charcoal)' }}>
            Planos e preços
          </h3>
          <p className="text-sm text-center mb-10" style={{ color: 'var(--gray)' }}>
            Escolha o plano ideal para sua prática · Garantia de 7 dias
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {PLANOS.map(plano => (
              <div
                key={plano.id}
                className="rounded-[18px] p-6 flex flex-col relative"
                style={{
                  backgroundColor: plano.destaque ? 'var(--forest)' : 'var(--cream)',
                  boxShadow: plano.destaque ? '0 8px 32px rgba(26,58,42,0.30)' : 'var(--shadow)',
                  border: plano.destaque ? 'none' : '1px solid var(--border-card)',
                  transform: plano.destaque ? 'scale(1.03)' : undefined,
                }}
              >
                {plano.destaque && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                    style={{ backgroundColor: 'var(--gold)', color: 'white' }}
                  >
                    Mais popular
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: plano.destaque ? 'rgba(255,255,255,0.60)' : 'var(--gray)' }}>
                    {plano.nome}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="font-display text-3xl font-bold"
                      style={{ color: plano.destaque ? 'white' : 'var(--charcoal)' }}>
                      {plano.preco}
                    </span>
                    <span className="text-sm pb-0.5" style={{ color: plano.destaque ? 'rgba(255,255,255,0.65)' : 'var(--gray)' }}>
                      {plano.periodo}
                    </span>
                  </div>
                  {plano.detalhe && (
                    <p className="text-xs mt-1"
                      style={{ color: plano.destaque ? 'rgba(255,255,255,0.70)' : 'var(--gold)' }}>
                      {plano.detalhe}
                    </p>
                  )}
                </div>

                <ul className="space-y-2 flex-1 mb-6">
                  {plano.items.map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle size={14} className="flex-shrink-0 mt-0.5"
                        style={{ color: plano.destaque ? 'var(--gold)' : 'var(--forest)' }} />
                      <span className="text-xs"
                        style={{ color: plano.destaque ? 'rgba(255,255,255,0.80)' : 'var(--charcoal)' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className="block text-center py-3 rounded-[12px] text-sm font-bold transition-all active:scale-95"
                  style={plano.destaque
                    ? { backgroundColor: 'var(--gold)', color: 'white' }
                    : { backgroundColor: 'var(--forest)', color: 'white' }}
                >
                  Assinar agora
                </Link>
              </div>
            ))}
          </div>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--gray-light)' }}>
            Todos os planos incluem garantia de 7 dias. Em caso de dúvidas, entre em contato.
          </p>
        </div>
      </section>

      {/* Para quem é */}
      <section className="px-5 md:px-12 py-14 md:py-16 max-w-5xl mx-auto">
        <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: 'var(--charcoal)' }}>
          Para quem é o AuriRegula Pro?
        </h3>
        <p className="text-sm text-center mb-10" style={{ color: 'var(--gray)' }}>
          Desenvolvido por e para profissionais da auriculoterapia clínica
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: GraduationCap,
              titulo: 'Recém-formados',
              desc: 'Acabou de concluir sua formação e precisa de segurança nos atendimentos? Os protocolos guiados e a avaliação por sintomas vão estruturar sua prática desde o primeiro paciente.',
              cor: 'var(--forest)',
            },
            {
              icon: Stethoscope,
              titulo: 'Profissionais em atividade',
              desc: 'Já atende mas quer aprofundar o raciocínio clínico? O Método R.E.G.U.L.A.® oferece embasamento neurofisiológico para elevar a qualidade dos seus resultados.',
              cor: 'var(--gold)',
            },
            {
              icon: Leaf,
              titulo: 'Terapeutas integrativas',
              desc: 'Trabalha com outras terapias e quer integrar a auriculoterapia ao seu atendimento? A plataforma organiza sua prática e facilita o registro de evolução clínica.',
              cor: 'var(--rose)',
            },
          ].map(({ icon: Icon, titulo, desc, cor }) => (
            <div key={titulo} className="card p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${cor}14` }}>
                <Icon size={22} style={{ color: cor }} />
              </div>
              <div>
                <p className="font-display text-lg font-bold mb-2" style={{ color: 'var(--charcoal)' }}>{titulo}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--gray)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA final */}
      <section className="px-5 md:px-12 py-14 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--charcoal)' }}>
            Transforme sua prática clínica
          </h3>
          <p className="text-sm mb-7" style={{ color: 'var(--gray)' }}>
            Junte-se aos auriculoterapeutas que já aplicam o Método R.E.G.U.L.A.® com mais segurança e eficácia.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[12px] text-sm font-bold transition-all active:scale-95"
            style={{ backgroundColor: 'var(--forest)', color: 'white', boxShadow: '0 4px 20px rgba(26,58,42,0.25)' }}
          >
            Criar minha conta
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-5 md:px-12 py-6" style={{ borderColor: 'rgba(26,58,42,0.10)', backgroundColor: 'white' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'var(--gray-light)' }}>
            © 2025 AuriRegula Pro · Método R.E.G.U.L.A.®
          </p>
          <div className="flex gap-5">
            <Link href="/termos" className="text-xs transition-colors" style={{ color: 'var(--gray-light)' }}>
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-xs transition-colors" style={{ color: 'var(--gray-light)' }}>
              Privacidade
            </Link>
            <Link href="/login" className="text-xs transition-colors" style={{ color: 'var(--forest)' }}>
              Entrar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
