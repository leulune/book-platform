'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <p className="text-center mt-10 text-white">Загрузка...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br via-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-black bg-opacity-80 shadow-2xl rounded-2xl p-10 text-center backdrop-blur-md">
        <h1 className="text-4xl font-bold text-white mb-4">Booking Platform Demo</h1>

        <p className="text-white text-2xl font-semibold">Добро пожаловать!</p>
        <p className="text-gray-300 mb-6 mt-2 font-light tracking-wide leading-relaxed">
          Здесь можно бронировать понравившиеся студии
        </p>

        {!user ? (
          <div className="flex justify-center gap-4">
            <a
              href="/auth/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Регистрация
            </a>
            <a
              href="/auth/login"
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              Вход
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-green-600 font-medium">
              Вы вошли как: <span className="underline underline-offset-2">{user.email}</span>
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/admin/halls"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Мои залы
              </a>
              <a
                href="/halls"
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100 transition"
              >
                Каталог
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
