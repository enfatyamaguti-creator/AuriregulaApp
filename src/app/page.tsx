'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { CheckCircle, Star, BookOpen, ClipboardList, Users, CalendarDays, Heart, GraduationCap, Stethoscope, Leaf, ChevronDown, X, Shield, ArrowRight, AlertCircle } from 'lucide-react';

const PLANOS = [
  {
    id: 'mensal',
    nome: 'Mensal',
    preco: 'R$ 9,99',
    precoOriginal: 'R$ 19,90',
    lancamento: true,
    periodo: '/mês',
    detalhe: null,
    destaque: false,
    checkout: process.env.NEXT_PUBLIC_CHECKOUT_MENSAL ?? '#',
    items: ['Acesso completo a todos os protocolos', 'Gestão de pacientes e prontuários', 'Agenda de sessões', 'Suporte por email'],
  },
  {
    id: 'anual',
    nome: 'Anual',
    preco: 'R$ 67,00',
    precoOriginal: 'R$ 97,90',
    lancamento: false,
    periodo: '/ano',
    detalhe: 'R$ 5,58/mês · Economia de 44%',
    destaque: true,
    checkout: process.env.NEXT_PUBLIC_CHECKOUT_ANUAL ?? '#',
    items: ['Tudo do plano mensal', 'Atualizações de protocolos incluídas', 'Novos módulos em primeira mão', 'Suporte prioritário'],
  },
];

const ANUNCIOS = [
  { texto: 'Preço especial de lançamento — Plano Mensal por apenas ', destaque: 'R$ 9,99/mês', cta: 'Garantir minha vaga →' },
  { texto: 'Formação Completa com curso + e-books + app por apenas ', destaque: 'R$ 197,00', cta: 'Saber mais →' },
  { texto: 'Garantia incondicional de 7 dias — experimente ', destaque: 'sem risco', cta: 'Ver planos →' },
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
    resposta: 'Sim. O banco de protocolos é atualizado continuamente. Assinantes do plano anual recebem as atualizações automaticamente, incluindo novos módulos e conteúdos clínicos.',
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

export default function LandingPage() {
  const [barVis, setBarVis] = useState(true);
  const [msgIdx, setMsgIdx] = useState(0);
  const [msgVis, setMsgVis] = useState(true);

  // Carrossel com fade
  useEffect(() => {
    if (!barVis) return;
    const id = setInterval(() => {
      setMsgVis(false);
      setTimeout(() => {
        setMsgIdx(i => (i + 1) % ANUNCIOS.length);
        setMsgVis(true);
      }, 350);
    }, 4500);
    return () => clearInterval(id);
  }, [barVis]);

  const anuncio = ANUNCIOS[msgIdx];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>

      {/* Barra de anúncio — fixa no topo */}
      {barVis && (
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center px-10 py-2.5 text-center"
          style={{ backgroundColor: '#1a3a2a' }}>
          <p
            className="text-xs font-medium transition-opacity duration-300"
            style={{ color: 'rgba(255,255,255,0.92)', opacity: msgVis ? 1 : 0 }}
          >
            {anuncio.texto}
            <strong style={{ color: 'var(--gold)' }}>{anuncio.destaque}</strong>.{' '}
            <a href="#planos" className="underline font-semibold" style={{ color: 'var(--gold)' }}>
              {anuncio.cta}
            </a>
          </p>
          <button
            onClick={() => setBarVis(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-opacity"
            style={{ opacity: 0.55 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
            aria-label="Fechar"
          >
            <X size={14} color="white" />
          </button>
        </div>
      )}

      {/* Spacer para a barra fixa */}
      <div style={{ height: barVis ? '40px' : 0, transition: 'height 0.3s ease' }} />

      {/* Nav — normal no topo da página */}
      <nav className="flex items-center justify-between px-5 md:px-12 py-3 border-b"
        style={{ backgroundColor: 'white', borderColor: 'rgba(26,58,42,0.10)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/AuriRegulaLogo.jpeg"
            alt="AuriRegula Pro"
            width={56}
            height={56}
            className="rounded-[10px] object-cover"
          />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest leading-none" style={{ color: 'var(--gray)' }}>Método R.E.G.U.L.A.®</p>
            <h1 className="font-display text-lg font-bold leading-tight" style={{ color: 'var(--forest)' }}>AuriRegula Pro</h1>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:block text-sm font-medium transition-colors"
            style={{ color: 'var(--gray)' }}
          >
            Entrar
          </Link>
          <a
            href="#planos"
            className="px-4 py-2 rounded-[10px] text-sm font-semibold transition-all active:scale-95"
            style={{ backgroundColor: 'var(--forest)', color: 'white' }}
          >
            Ver planos
          </a>
        </div>
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

        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-left">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{ backgroundColor: 'rgba(184,151,74,0.20)', color: 'var(--gold)', border: '1px solid rgba(184,151,74,0.35)' }}
            >
              Plataforma clínica para auriculoterapeutas
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Atenda com mais <br className="hidden md:block" />
              segurança e resultado
            </h2>
            <p className="text-base md:text-lg mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
              O Método R.E.G.U.L.A.® estrutura sua prática clínica com protocolos neurofisiológicos validados, gestão de pacientes e ferramentas de evolução — tudo em um só lugar.
            </p>
            <div className="p-4 rounded-[14px] mb-8" style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderLeft: '3px solid var(--gold)' }}>
              <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.90)' }}>
                "Seu corpo não está apenas doente. Muitas vezes, ele está desregulado."
              </p>
            </div>
            <a
              href="#planos"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[12px] text-sm font-bold transition-all active:scale-95"
              style={{ backgroundColor: 'var(--gold)', color: 'white', boxShadow: '0 4px 20px rgba(184,151,74,0.40)' }}
            >
              Começar por R$ 9,99/mês
              <ArrowRight size={16} />
            </a>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {[
                { label: 'Acesso imediato',       iconColor: '#1a3a2a' },
                { label: 'Cancele quando quiser', iconColor: 'var(--gold)' },
                { label: 'Garantia de 7 dias',    iconColor: 'var(--gold)' },
              ].map(({ label, iconColor }) => (
                <span key={label} className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
                  <CheckCircle size={12} style={{ color: iconColor }} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 flex justify-center md:justify-end">
            <Image
              src="/images/MockupDevices.png"
              alt="AuriRegula Pro nos dispositivos"
              width={520}
              height={400}
              className="w-full max-w-sm md:max-w-lg object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Tira de confiança */}
      <section className="px-5 md:px-12 py-4 border-b" style={{ backgroundColor: 'white', borderColor: 'rgba(26,58,42,0.10)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 md:gap-x-14">
            {[
              { destaque: '100+', sub: 'Protocolos clínicos' },
              { destaque: 'Método R.E.G.U.L.A.®', sub: 'Registrado e validado' },
              { destaque: 'Acesso imediato', sub: 'Após confirmação do pagamento' },
              { destaque: '7 dias', sub: 'Garantia incondicional' },
            ].map(({ destaque, sub }) => (
              <div key={destaque} className="flex flex-col items-center text-center">
                <p className="text-sm font-bold leading-tight" style={{ color: 'var(--forest)' }}>{destaque}</p>
                <p className="text-[11px] leading-tight" style={{ color: 'var(--gray)' }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section className="px-5 md:px-12 py-14 md:py-16 max-w-5xl mx-auto">
        <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: 'var(--charcoal)' }}>
          Tudo que você precisa na prática clínica
        </h3>
        <p className="text-sm text-center mb-10" style={{ color: 'var(--gray)' }}>
          Recursos desenvolvidos especialmente para auriculoterapeutas
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

      {/* Para quem é */}
      <section className="px-5 md:px-12 py-14 md:py-16 w-full" style={{ backgroundColor: 'white' }}>
        <div className="max-w-5xl mx-auto">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: 'var(--charcoal)' }}>
            Para quem é o AuriRegula Pro?
          </h3>
          <p className="text-sm text-center mb-10" style={{ color: 'var(--gray)' }}>
            Desenvolvido por e para profissionais da auriculoterapia clínica
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: GraduationCap, titulo: 'Recém-formados',          desc: 'Acabou de concluir sua formação e precisa de segurança nos atendimentos? Os protocolos guiados e a avaliação por sintomas vão estruturar sua prática desde o primeiro paciente.', cor: 'var(--forest)' },
              { icon: Stethoscope,   titulo: 'Profissionais em atividade', desc: 'Já atende mas quer aprofundar o raciocínio clínico? O Método R.E.G.U.L.A.® oferece embasamento neurofisiológico para elevar a qualidade dos seus resultados.',             cor: 'var(--gold)'   },
              { icon: Leaf,          titulo: 'Terapeutas integrativas',  desc: 'Trabalha com outras terapias e quer integrar a auriculoterapia ao seu atendimento? A plataforma organiza sua prática e facilita o registro de evolução clínica.',               cor: 'var(--rose)'   },
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
        </div>
      </section>

      {/* Seção de dores */}
      <section className="px-5 md:px-12 py-14 md:py-16" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="max-w-5xl mx-auto">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: 'var(--charcoal)' }}>
            Sua prática merece mais do que improvisar
          </h3>
          <p className="text-sm text-center mb-10" style={{ color: 'var(--gray)' }}>
            Você se reconhece em alguma dessas situações?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { icon: AlertCircle,   desc: 'Insegurança ao escolher os pontos sem um método clínico estruturado' },
              { icon: ClipboardList, desc: 'Dificuldade em registrar e acompanhar a evolução dos pacientes'       },
              { icon: BookOpen,      desc: 'Falta de embasamento científico para justificar suas escolhas terapêuticas' },
            ].map(({ icon: Icon, desc }) => (
              <div key={desc} className="card p-5 flex items-start gap-4"
                style={{ borderLeft: '4px solid rgba(184,151,74,0.40)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(184,151,74,0.10)' }}>
                  <Icon size={16} style={{ color: 'var(--gold)' }} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center p-8 rounded-[18px]" style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2d5a42 100%)' }}>
            <p className="font-display text-xl md:text-2xl font-bold text-white mb-2">
              O AuriRegula Pro resolve exatamente isso.
            </p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.70)' }}>
              Protocolos validados, raciocínio clínico estruturado e gestão completa — em um app feito por quem entende a prática.
            </p>
            <a
              href="#planos"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-[12px] text-sm font-bold transition-all active:scale-95"
              style={{ backgroundColor: 'var(--gold)', color: 'white' }}
            >
              Quero estruturar minha prática
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      {/* Planos */}
      <section id="planos" className="px-5 md:px-12 py-14 md:py-16" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="relative flex items-center justify-center mb-2">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-center" style={{ color: 'var(--charcoal)' }}>
              Planos e preços
            </h3>
            <Image
              src="/images/SeloGarantia7Dias.png"
              alt="Garantia de 7 dias"
              width={120}
              height={120}
              className="absolute right-0 top-1/2 -translate-y-1/2 opacity-90 rotate-[10deg] hidden md:block"
            />
          </div>
          <p className="text-sm text-center mb-8" style={{ color: 'var(--gray)' }}>
            Escolha o plano ideal para sua prática · Cancele quando quiser
          </p>

          {/* Garantia */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="p-5 rounded-[14px] flex flex-col md:flex-row items-center gap-4"
              style={{ backgroundColor: 'rgba(26,58,42,0.06)', border: '2px solid rgba(26,58,42,0.12)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(26,58,42,0.10)' }}>
                <Shield size={22} style={{ color: 'var(--forest)' }} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--charcoal)' }}>
                  Garantia incondicional de 7 dias — risco zero
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--gray)' }}>
                  Se nos primeiros 7 dias você não estiver 100% satisfeito, devolvemos cada centavo. Sem perguntas, sem burocracia.
                </p>
              </div>
            </div>
          </div>

          {/* Cards de plano */}
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
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
                    style={{ backgroundColor: 'var(--gold)', color: 'white' }}>
                    Mais popular
                  </div>
                )}
                {plano.lancamento && !plano.destaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
                    style={{ backgroundColor: 'var(--forest)', color: 'white' }}>
                    Oferta de lançamento
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: plano.destaque ? 'rgba(255,255,255,0.60)' : 'var(--gray)' }}>
                    {plano.nome}
                  </p>
                  {plano.precoOriginal && (
                    <p className="text-sm line-through mb-0.5"
                      style={{ color: plano.destaque ? 'rgba(255,255,255,0.40)' : 'var(--gray-light)' }}>
                      {plano.precoOriginal}
                    </p>
                  )}
                  <div className="flex items-end gap-1">
                    <span className="font-display text-3xl font-bold"
                      style={{ color: plano.destaque ? 'white' : 'var(--charcoal)' }}>
                      {plano.preco}
                    </span>
                    <span className="text-sm pb-0.5"
                      style={{ color: plano.destaque ? 'rgba(255,255,255,0.65)' : 'var(--gray)' }}>
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

                <a
                  href={plano.checkout}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 rounded-[12px] text-sm font-bold transition-all active:scale-95"
                  style={plano.destaque
                    ? { backgroundColor: 'var(--gold)', color: 'white' }
                    : { backgroundColor: 'var(--forest)', color: 'white' }}
                >
                  Assinar agora
                </a>
              </div>
            ))}
          </div>

          {/* Card Formação Completa */}
          <div className="mt-8 max-w-2xl mx-auto relative rounded-[18px]"
            style={{ background: 'linear-gradient(135deg, #b8974a 0%, #d4af6a 50%, #b8974a 100%)', boxShadow: '0 8px 40px rgba(184,151,74,0.40)' }}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
              style={{ backgroundColor: 'var(--forest)', color: 'white' }}>
              Pacote Completo · Melhor investimento
            </div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.70)' }}>
                  Formação
                </p>
                <h4 className="font-display text-xl md:text-2xl font-bold leading-snug mb-2" style={{ color: 'white' }}>
                  Formação Completa em Auriculoterapia Clínica &amp; Integrativa
                </h4>
                <div className="flex items-end gap-2 mb-4">
                  <p className="text-sm line-through" style={{ color: 'rgba(255,255,255,0.50)' }}>R$ 297,00</p>
                  <span className="font-display text-4xl font-bold text-white">R$ 197,00</span>
                  <span className="text-sm pb-1" style={{ color: 'rgba(255,255,255,0.70)' }}>à vista</span>
                </div>
                <ul className="space-y-2">
                  {[
                    'Plano anual do app AuriRegula Pro',
                    'Curso de Auriculoterapia do Básico ao Avançado',
                    'E-book: AuriRegula Protocolos de Auriculoterapia Clínica Baseada em Raciocínio Neurofisiológico',
                    'E-book: Atlas Auricular',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'white' }} />
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.90)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-auto md:self-center">
                <a
                  href={process.env.NEXT_PUBLIC_CHECKOUT_FORMACAO ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-8 py-3.5 rounded-[12px] text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
                  style={{ backgroundColor: 'var(--forest)', color: 'white', boxShadow: '0 4px 16px rgba(26,58,42,0.30)' }}
                >
                  Quero a formação completa
                </a>
              </div>
            </div>
          </div>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--gray-light)' }}>
            Todos os planos incluem garantia de 7 dias. Em caso de dúvidas, entre em contato.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-5 md:px-12 py-14 text-center" style={{ backgroundColor: 'white' }}>
        <div className="max-w-2xl mx-auto">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--charcoal)' }}>
            Comece hoje. Veja a diferença na sua próxima sessão.
          </h3>
          <p className="text-sm mb-7" style={{ color: 'var(--gray)' }}>
            Junte-se aos auriculoterapeutas que já aplicam o Método R.E.G.U.L.A.® com mais segurança e eficácia. Acesso imediato após a assinatura.
          </p>
          <a
            href="#planos"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[12px] text-sm font-bold transition-all active:scale-95"
            style={{ backgroundColor: 'var(--forest)', color: 'white', boxShadow: '0 4px 20px rgba(26,58,42,0.25)' }}
          >
            Ver Planos
            <ArrowRight size={15} />
          </a>
          <p className="text-xs mt-3" style={{ color: 'var(--gray-light)' }}>
            A partir de R$ 9,99/mês · Garantia de 7 dias · Sem contrato
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-5 md:px-12 py-6" style={{ borderColor: 'rgba(26,58,42,0.10)', backgroundColor: 'var(--cream)' }}>
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
