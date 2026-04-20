import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function gerarPlanoTerapeutico(
  nomeProtocolo: string,
  pontos: string[],
  frequencia: string,
  observacoes: string,
  nomePaciente?: string,
): string {
  const data = new Date().toLocaleDateString('pt-BR');
  return `
PLANO TERAPÊUTICO — AURICULOTERAPIA
Método R.E.G.U.L.A.® | AuriRegula Pro
Data: ${data}
${nomePaciente ? `Paciente: ${nomePaciente}` : ''}

PROTOCOLO: ${nomeProtocolo}

PONTOS AURICULARES:
${pontos.map((p, i) => `${i + 1}. ${p}`).join('\n')}

FREQUÊNCIA SUGERIDA:
${frequencia}

OBSERVAÇÕES CLÍNICAS:
${observacoes}

---
"Seu corpo não está apenas doente. Muitas vezes, ele está desregulado."
— Método R.E.G.U.L.A.®

Este plano é um apoio ao raciocínio clínico e não substitui avaliação
profissional individualizada. O julgamento clínico do terapeuta é sempre
determinante na escolha e adaptação do protocolo.
`.trim();
}

export function copiarTexto(texto: string): Promise<void> {
  return navigator.clipboard.writeText(texto);
}
