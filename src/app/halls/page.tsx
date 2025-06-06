import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function HallsPage() {
    const { data: halls, error } = await supabase.from('dance_halls').select('*');

    if (error) {
        return <p className="text-red-500">Ошибка загрузки залов: {error.message}</p>;
    }

    if (!halls || halls.length === 0) {
        return <p>Нет доступных залов</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6">Каталог залов</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {halls.map((hall) => (
                    <div key={hall.id} className="border rounded p-4 shadow">
                        {hall.image_url && (
                            <img
                                src={hall.image_url}
                                alt={hall.name}
                                className="w-full h-48 object-cover mb-4 rounded"
                            />
                        )}
                        <h2 className="text-xl font-semibold mb-2">{hall.name}</h2>
                        <p><strong>Адрес:</strong> {hall.address}</p>
                        <p><strong>Вместимость:</strong> {hall.capacity}</p>
                        <Link href={`/halls/${hall.id}`} className="text-blue-600 hover:underline mt-2 inline-block">
                            Подробнее
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}