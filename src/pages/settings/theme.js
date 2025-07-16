import AppLayout from '../../components/AppLayout';
import ThemeSwitcher from '../../components/ThemeSwitcher';

export default function ThemeSettingsPage() {
  return (
    <AppLayout>
      <div className="max-w-lg mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">테마 설정</h1>
        <ThemeSwitcher />
      </div>
    </AppLayout>
  );
} 