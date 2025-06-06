'use client';

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface HallFormData {
    name: string;
    address: string;
    capacity: string;
    image_url: string;
}

export default function NewHallPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const { register, handleSubmit, reset } = useForm<HallFormData>();

    const onSubmit: SubmitHandler<HallFormData> = async (data) => {
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            setError('Пользователь не аутентифицирован');
            return;
        }

        const { error } = await supabase.from('dance_halls').insert([
            {
                owner_user_id: user.id,
                name: data.name,
                address: data.address,
                capacity: parseInt(data.capacity, 10),
                image_url: data.image_url,
            },
        ]);

        if (error) {
            setError(error.message);
        } else {
            await fetch('/api/email-notice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: user.email,
                    subject: 'Зал успешно создан',
                    text: `Зал "${data.name}" был успешно добавлен в систему`
                }),
            })

            reset();
            router.push('/admin/halls');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Добавить новый зал</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    type="text"
                    placeholder="Название"
                    {...register('name', { required: true })}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Адрес"
                    {...register('address', { required: true })}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Вместимость"
                    {...register('capacity', { required: true })}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="URL изображения"
                    {...register('image_url')}
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Сохранить
                </button>
            </form>
        </div>
    );
}