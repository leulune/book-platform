'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface DanceHall {
  id: string;
  name: string;
  address: string;
  capacity: number;
  image_url: string;
  created_at: string;
}

export default function AdminHallsPage() {
  const [halls, setHalls] = useState<DanceHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchHalls = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('Пользователь не аутентифицирован');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('dance_halls')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setHalls(data || []);
      }

      setLoading(false);
    };

    fetchHalls();
  }, []);

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('dance_halls')
      .delete()
      .eq('id', id);

    if (deleteError) {
      alert('Ошибка при удалении: ' + deleteError.message);
    } else {
      setHalls((prev) => prev.filter((hall) => hall.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/halls/${id}/edit`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Мои залы</h1>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && halls.length === 0 && (
        <p className="text-gray-600">У вас пока нет добавленных залов.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {halls.map((hall) => (
          <div
            key={hall.id}
            className="border rounded p-4 shadow-sm bg-white"
          >
            {hall.image_url && (
              <img
                src={hall.image_url}
                alt={hall.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-black">{hall.name}</h2>
            <p className="text-gray-600">{hall.address}</p>
            <p className="text-sm text-gray-500">
              Вместимость: {hall.capacity}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(hall.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(hall.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
