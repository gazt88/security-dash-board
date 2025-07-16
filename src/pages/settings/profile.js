import { useEffect, useState, useRef } from 'react';
import AppLayout from '../../components/AppLayout';
import { supabase } from '../../utils/supabaseClient';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const user = supabase.auth.user();
      if (!user) return;
      const { data } = await supabase.from('user').select('*').eq('email', user.email).single();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, name: e.target.value });
  };

  const handleSave = async () => {
    setMsg('');
    const user = supabase.auth.user();
    if (!user) return;
    const { error } = await supabase.from('user').update({ name: profile.name, avatar_url: profile.avatar_url }).eq('email', user.email);
    if (error) setMsg('저장 실패');
    else setMsg('저장됨');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const user = supabase.auth.user();
    if (!user) return;
    const filePath = `avatars/${user.id}`;
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (!error) {
      const { publicURL } = supabase.storage.from('avatars').getPublicUrl(filePath).data;
      setProfile(p => ({ ...p, avatar_url: publicURL }));
      setMsg('프로필 사진 업로드 완료');
    } else {
      setMsg('업로드 실패');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">프로필 설정</h1>
        {loading ? (
          <div className="text-gray-500 py-8">로딩 중...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="프로필" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl">?</div>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <button onClick={() => fileInputRef.current.click()} className="bg-gray-200 px-3 py-1 rounded">사진 변경</button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">이메일</label>
              <input value={profile.email} disabled className="w-full border rounded px-2 py-1 bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">이름</label>
              <input value={profile.name} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">저장</button>
            {msg && <div className="mt-2 text-green-600">{msg}</div>}
          </div>
        )}
      </div>
    </AppLayout>
  );
} 