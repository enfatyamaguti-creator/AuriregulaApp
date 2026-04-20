import { createClient } from '@/lib/supabase';

export type StatusAgendamento = 'agendado' | 'realizado' | 'cancelado';

export interface Agendamento {
  id: string;
  pacienteNome: string;
  data: string;
  hora: string;
  protocolo?: string;
  observacoes?: string;
  status: StatusAgendamento;
  createdAt: string;
}

function mapAgendamento(row: Record<string, unknown>): Agendamento {
  return {
    id: row.id as string,
    pacienteNome: row.paciente_nome as string,
    data: row.data as string,
    hora: row.hora as string,
    protocolo: row.protocolo as string | undefined,
    observacoes: row.observacoes as string | undefined,
    status: row.status as StatusAgendamento,
    createdAt: row.created_at as string,
  };
}

export async function getAgendamentos(): Promise<Agendamento[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('agendamentos')
    .select('*')
    .order('data', { ascending: true })
    .order('hora', { ascending: true });
  return (data ?? []).map(mapAgendamento);
}

export async function addAgendamento(
  dados: Omit<Agendamento, 'id' | 'createdAt' | 'status'>,
): Promise<Agendamento | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('agendamentos')
    .insert({
      user_id: user.id,
      paciente_nome: dados.pacienteNome,
      data: dados.data,
      hora: dados.hora,
      protocolo: dados.protocolo ?? null,
      observacoes: dados.observacoes ?? null,
      status: 'agendado',
    })
    .select()
    .single();
  return data ? mapAgendamento(data) : null;
}

export async function updateStatus(id: string, status: StatusAgendamento): Promise<void> {
  const supabase = createClient();
  await supabase.from('agendamentos').update({ status }).eq('id', id);
}

export async function deleteAgendamento(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from('agendamentos').delete().eq('id', id);
}

export async function getAgendamentosHoje(): Promise<Agendamento[]> {
  const hoje = new Date().toISOString().slice(0, 10);
  const supabase = createClient();
  const { data } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('data', hoje)
    .eq('status', 'agendado')
    .order('hora', { ascending: true });
  return (data ?? []).map(mapAgendamento);
}

export async function getProximos(): Promise<Agendamento[]> {
  const hoje = new Date().toISOString().slice(0, 10);
  const supabase = createClient();
  const { data } = await supabase
    .from('agendamentos')
    .select('*')
    .gte('data', hoje)
    .eq('status', 'agendado')
    .order('data', { ascending: true })
    .order('hora', { ascending: true });
  return (data ?? []).map(mapAgendamento);
}
