import { createClient } from '@/lib/supabase';
import type { Paciente, Sessao, StatusPaciente } from '@/types';

function mapSessao(row: Record<string, unknown>): Sessao {
  return {
    id: row.id as string,
    pacienteId: row.paciente_id as string,
    dataSessao: row.data_sessao as string,
    numeroSessao: row.numero_sessao as number,
    queixaDia: (row.queixa_dia as string) ?? '',
    protocoloId: row.protocolo_id as string | undefined,
    protocoloNome: (row.protocolo_nome as string) ?? '',
    pontosUsados: (row.pontos_usados as string[]) ?? [],
    escalaDor: (row.escala_dor as number) ?? 0,
    escalaAnsiedade: (row.escala_ansiedade as number) ?? 0,
    qualidadeSono: (row.qualidade_sono as number) ?? 0,
    observacoes: (row.observacoes as string) ?? '',
    ajustes: (row.ajustes as string) ?? '',
    proximoRetorno: row.proximo_retorno as string | undefined,
    createdAt: row.created_at as string,
  };
}

function mapPaciente(row: Record<string, unknown>): Paciente {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    nome: row.nome as string,
    idade: (row.idade as number) ?? 0,
    sexo: row.sexo as 'Feminino' | 'Masculino' | 'Outro',
    telefone: (row.telefone as string) ?? '',
    queixaPrincipal: row.queixa_principal as string,
    status: row.status as StatusPaciente,
    sessoes: Array.isArray(row.sessoes)
      ? (row.sessoes as Record<string, unknown>[]).map(mapSessao)
      : [],
    proximoRetorno: row.proximo_retorno as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getPacientes(): Promise<Paciente[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('pacientes')
    .select('*, sessoes(*)')
    .order('created_at', { ascending: false });
  return (data ?? []).map(mapPaciente);
}

export async function getPacienteById(id: string): Promise<Paciente | undefined> {
  const supabase = createClient();
  const { data } = await supabase
    .from('pacientes')
    .select('*, sessoes(*)')
    .eq('id', id)
    .single();
  return data ? mapPaciente(data) : undefined;
}

export async function savePaciente(paciente: Paciente): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('pacientes').upsert({
    id: paciente.id,
    user_id: user.id,
    nome: paciente.nome,
    idade: paciente.idade,
    sexo: paciente.sexo,
    telefone: paciente.telefone,
    queixa_principal: paciente.queixaPrincipal,
    status: paciente.status,
    proximo_retorno: paciente.proximoRetorno ?? null,
  });
}

export async function updatePacienteStatus(id: string, status: StatusPaciente): Promise<void> {
  const supabase = createClient();
  await supabase.from('pacientes').update({ status }).eq('id', id);
}

export async function addSessao(
  pacienteId: string,
  sessao: Omit<Sessao, 'id' | 'pacienteId' | 'createdAt'>,
): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('sessoes').insert({
    paciente_id: pacienteId,
    user_id: user.id,
    data_sessao: sessao.dataSessao,
    numero_sessao: sessao.numeroSessao,
    queixa_dia: sessao.queixaDia,
    protocolo_id: sessao.protocoloId ?? null,
    protocolo_nome: sessao.protocoloNome,
    pontos_usados: sessao.pontosUsados,
    escala_dor: sessao.escalaDor,
    escala_ansiedade: sessao.escalaAnsiedade,
    qualidade_sono: sessao.qualidadeSono,
    observacoes: sessao.observacoes,
    ajustes: sessao.ajustes,
    proximo_retorno: sessao.proximoRetorno ?? null,
  });
}

export async function deletePaciente(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from('sessoes').delete().eq('paciente_id', id);
  await supabase.from('pacientes').delete().eq('id', id);
}

export function generateId(): string {
  return crypto.randomUUID();
}
