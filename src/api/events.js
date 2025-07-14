import { supabase } from '../utils/supabase';

export async function fetchEvents(year, month) {
  // 해당 월의 모든 이벤트 조회
  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const to = `${year}-${String(month).padStart(2, '0')}-31`;
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .gte('start_at', from)
    .lte('end_at', to);
  if (error) throw error;
  return data;
}

export async function addEvent(event) {
  const { data, error } = await supabase.from('event').insert([event]).select();
  if (error) throw error;
  return data[0];
}

export async function updateEvent(id, updates) {
  const { data, error } = await supabase.from('event').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteEvent(id) {
  const { error } = await supabase.from('event').delete().eq('id', id);
  if (error) throw error;
}

export function subscribeEvents(callback) {
  // Supabase Realtime 구독
  return supabase.channel('event').on('postgres_changes', { event: '*', schema: 'public', table: 'event' }, callback).subscribe();
} 