/* ─────────────────────────────────────────────
   AuriRegula Pro — Tipos TypeScript
   ───────────────────────────────────────────── */

export type CorPonto = 'main' | 'neuro' | 'endoc' | 'visceral' | 'col' | 'rose';
export type CorTema  = 'forest' | 'rose' | 'amber' | 'teal' | 'purple';
export type GrupoProt = 'regulacao' | 'dor' | 'coluna' | 'emocional' | 'sono' | 'cefaleia' | 'hormonal' | 'mulher' | 'digestivo' | 'habitos' | 'complementares' | 'pediatria' | 'adolescente' | 'idoso' | 'esporte' | 'gestante' | 'oncologia' | 'emagrecimento' | 'vicios' | 'tea' | 'combinados' | 'master-dor';
export type Populacao = 'pediatria' | 'adolescente' | 'idoso' | 'esporte' | 'mulher' | 'gestante' | 'oncologia' | 'emagrecimento' | 'vicios' | 'tea' | null;
export type PerfilUsuario = 'profissional' | 'aluno';
export type StatusPaciente = 'ativo' | 'alta' | 'pausado' | 'manutencao';

export interface PontoAuricular {
  nome: string;
  px: number;
  py: number;
  zona: string;
  cor: CorPonto;
}

export interface Protocolo {
  id: string;
  slug: string;
  nome: string;
  categoria: string;
  grupo: GrupoProt;
  populacao: Populacao;
  indicacao: string;
  objetivo: string;
  pontos: string[];
  racional: string;
  sinais: string[];
  frequencia: string;
  observacoes: string;
  cuidados: string;
  corTema: CorTema;
  isMaster: boolean;
}

export interface Paciente {
  id: string;
  userId: string;
  nome: string;
  idade: number;
  sexo: 'Feminino' | 'Masculino' | 'Outro';
  telefone: string;
  queixaPrincipal: string;
  status: StatusPaciente;
  sessoes?: Sessao[];
  proximoRetorno?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sessao {
  id: string;
  pacienteId: string;
  dataSessao: string;
  numeroSessao: number;
  queixaDia: string;
  protocoloId?: string;
  protocoloNome: string;
  pontosUsados: string[];
  escalaDor: number;
  escalaAnsiedade: number;
  qualidadeSono: number;
  observacoes: string;
  ajustes: string;
  proximoRetorno?: string;
  createdAt: string;
}

export interface Capitulo {
  id: string;
  numero: number;
  titulo: string;
  subtitulo?: string;
  conteudo: string;
  ordem: number;
}

export interface ResultadoSugestao {
  queixaPrincipal: string;
  sinaisSelecionados: string[];
  intensidade: number;
  protocoloMaster: Protocolo;
  protocoloEspecifico: Protocolo | null;
  protocoloComplementar: Protocolo | null;
  leituraFisiologica: string;
}

export interface FiltroProtocolo {
  busca: string;
  grupo: GrupoProt | 'todos';
  populacao: Populacao;
  corTema: CorTema | 'todos';
}
