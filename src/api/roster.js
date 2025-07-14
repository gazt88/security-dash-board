import { supabase } from '../utils/supabase';

export async function fetchRoster(month) {
  // month: 'YYYY-MM'
  const from = `${month}-01`;
  const to = `${month}-31`;
  const { data, error } = await supabase
    .from('on_call_shift')
    .select('*, user:user_id(name)')
    .gte('shift_date', from)
    .lte('shift_date', to)
    .order('shift_date', { ascending: true });
  if (error) throw error;
  // user_name 필드 추가
  return data.map(s => ({ ...s, user_name: s.user?.name || '' }));
}

export async function addRosterShift(shift) {
  const { data, error } = await supabase.from('on_call_shift').insert([shift]).select();
  if (error) throw error;
  return data[0];
}

export async function updateRosterShift(id, updates) {
  const { data, error } = await supabase.from('on_call_shift').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteRosterShift(id) {
  const { error } = await supabase.from('on_call_shift').delete().eq('id', id);
  if (error) throw error;
}

export function subscribeRoster(callback) {
  return supabase.channel('on_call_shift').on('postgres_changes', { event: '*', schema: 'public', table: 'on_call_shift' }, callback).subscribe();
}

// 자동 생성: 평일+공휴일 제외, 팀원 순번대로
export async function generateRoster(month, users, holidays) {
  const shifts = [];
  const date = new Date(month + '-01');
  let idx = 0;
  while (date.getMonth() + 1 === parseInt(month.slice(5))) {
    const ymd = date.toISOString().slice(0, 10);
    const day = date.getDay();
    if (day !== 0 && day !== 6 && !holidays.includes(ymd)) {
      shifts.push({ shift_date: ymd, user_id: users[idx % users.length].id, status: 'scheduled' });
      idx++;
    }
    date.setDate(date.getDate() + 1);
  }
  // 일괄 insert
  const { data, error } = await supabase.from('on_call_shift').insert(shifts).select();
  if (error) throw error;
  return data;
} 