import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PageProps } from "../../../../.next/types/app/layout";

interface HallDetailPageProps {
    params: { id: string };
}

export default async function HallDetailPage({ params }: HallDetailPageProps) {
    const { id } = params;

    const { data: hall, error } = await supabase
        .from('dance_halls')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !hall) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-4">{hall.name}</h1>
            {hall.image_url && (
                <Image
                    src={hall.image_url}
                    alt={hall.name}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover mb-4 rounded"
                />
            )}
            <p><strong>Адрес:</strong> {hall.address}</p>
            <p><strong>Вместимость:</strong> {hall.capacity}</p>
            <p><strong>Дата создания:</strong> {new Date(hall.created_at).toLocaleDateString()}</p>
        </div>
    )
}