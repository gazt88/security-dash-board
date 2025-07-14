import { supabase } from '../utils/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('schedules').select('*').order('date', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({
      data,
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'set' : 'unset'
      }
    });
  } else if (req.method === 'POST') {
    // 전체 덮어쓰기(간단 구현)
    const { value } = req.body;
    // 기존 데이터 삭제
    await supabase.from('schedules').delete().neq('id', '');
    // 새 데이터 삽입
    if (Array.isArray(value) && value.length > 0) {
      const { error } = await supabase.from('schedules').insert(value);
      if (error) return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ ok: true });
  } else if (req.method === 'DELETE') {
    await supabase.from('schedules').delete().neq('id', '');
    res.status(200).json({ ok: true });
  } else {
    res.status(405).end();
  }
} 