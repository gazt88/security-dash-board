import { supabase } from '../utils/supabase';

// 이벤트 CRUD
export async function getEvents() {
  return supabase.from('events').select('*').order('start_at', { ascending: true });
}
export async function addEvent(data) {
  return supabase.from('events').insert([data]);
}
export async function updateEvent(id, data) {
  // 모든 사용자가 수정 가능 (RLS 정책에 따라 허용)
  return supabase.from('events').update(data).eq('id', id);
}
export async function deleteEvent(id) {
  return supabase.from('events').delete().eq('id', id);
}
export function subscribeEvents(onChange) {
  return supabase
    .channel('public:events')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
      onChange(payload);
    })
    .subscribe();
}

// 이벤트 전체 삭제
export async function deleteAllEvents() {
  return supabase.from('events').delete().neq('id', '');
}

// 여러 이벤트 삽입
export async function insertEvents(events) {
  return supabase.from('events').insert(events);
}

// 로스터 CRUD
export async function getRoster() {
  return supabase.from('on_call_shift').select('*').order('shift_date', { ascending: true });
}
export async function addRoster(data) {
  return supabase.from('on_call_shift').insert([data]);
}
export async function updateRoster(id, data) {
  return supabase.from('on_call_shift').update(data).eq('id', id);
}
export async function deleteRoster(id) {
  return supabase.from('on_call_shift').delete().eq('id', id);
}
export function subscribeRoster(onChange) {
  return supabase
    .channel('public:on_call_shift')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'on_call_shift' }, payload => {
      onChange(payload);
    })
    .subscribe();
}

// 공휴일 CRUD
export async function getHolidays() {
  return supabase.from('holiday').select('*').order('date', { ascending: true });
}
export async function addHoliday(data) {
  return supabase.from('holiday').insert([data]);
}
export async function updateHoliday(id, data) {
  return supabase.from('holiday').update(data).eq('id', id);
}
export async function deleteHoliday(id) {
  return supabase.from('holiday').delete().eq('id', id);
}
export function subscribeHolidays(onChange) {
  return supabase
    .channel('public:holiday')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'holiday' }, payload => {
      onChange(payload);
    })
    .subscribe();
} 