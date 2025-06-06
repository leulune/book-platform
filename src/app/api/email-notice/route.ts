import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const body = await req.json()
    const { to, subject, text } = body

    console.log('--- Симуляция отправки письма ---')
    console.log(`Кому: ${to}`)
    console.log(`Тема: ${subject}`)
    console.log(`Текст: ${text}`)
    console.log('--- Конец письма ---')

    return NextResponse.json({ success: true })
}