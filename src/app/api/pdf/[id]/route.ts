import { supabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(
    req: NextRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any
) {
    const { id } = context.params;

    const { data, error } = await supabase
        .from("dance_halls")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const textLines = [
        `Name: ${data.name}`,
        `Address: ${data.address}`,
        `Capacity: ${data.capacity}`,
        `Created at: ${new Date(data.created_at).toLocaleDateString()}`
    ];

    page.drawText(textLines.join("\n"), {
        x: 50,
        y: 600,
        size: 14,
        font,
        color: rgb(0, 0, 0),
        lineHeight: 20
    });

    if (data.image_url) {
        try {
            const res = await fetch(data.image_url);
            const imgBytes = await res.arrayBuffer();
            const image = await pdfDoc.embedJpg(imgBytes);
            page.drawImage(image, {
                x: 50,
                y: 300,
                width: 200,
                height: 200
            });
        } catch (e) {
            console.error("Image loading error:", e);
        }
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="hall-${id}.pdf"`
        }
    });
}
