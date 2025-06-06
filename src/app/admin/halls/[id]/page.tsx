'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Hall {
  id: string;
  name: string;
  address: string;
  capacity: number;
  image_url?: string;
  created_at: string;
}

export default function HallDetailPage() {
  const { id } = useParams();
  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchHall = async () => {
      const { data, error } = await supabase
        .from('dance_halls')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setHall(data);
      }
      setLoading(false);
    };

    fetchHall();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">Ошибка: {error}</p>;
  if (!hall) return <p>Зал не найден</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">{hall.name}</h1>
      {hall.image_url && (
        <img
          src={hall.image_url}
          alt={hall.name}
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}
      <p><strong>Адрес:</strong> {hall.address}</p>
      <p><strong>Вместимость:</strong> {hall.capacity}</p>
      <p><strong>Дата создания:</strong> {new Date(hall.created_at).toLocaleDateString()}</p>

      <a
        href={`/api/pdf/${hall.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Скачать PDF
      </a>

    </div>
  );
}
