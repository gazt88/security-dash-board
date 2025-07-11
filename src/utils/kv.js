// Vercel KV 연동 유틸리티 (서버리스 함수/클라이언트 공용)
// 환경변수: process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN

export async function kvGet(key) {
  const url = `${process.env.KV_REST_API_URL}/get/${key}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}` }
  });
  if (!res.ok) throw new Error('KV get 실패');
  return res.json();
}

export async function kvSet(key, value) {
  const url = `${process.env.KV_REST_API_URL}/set/${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value })
  });
  if (!res.ok) throw new Error('KV set 실패');
  return res.json();
}

export async function kvDel(key) {
  const url = `${process.env.KV_REST_API_URL}/del/${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}` }
  });
  if (!res.ok) throw new Error('KV del 실패');
  return res.json();
} 