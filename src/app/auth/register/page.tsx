'use client'

import { supabase } from "@/lib/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: any) => {
        const { email, password } = data
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError) {
            setError(signUpError.message)
            return
        }

        await fetch('/api/email-notice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: email,
                subject: 'Добро пожаловать в платформу!',
                text: 'Вы успешно зарегистрированы'
            }),
        })

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) {
            setError('Регистрация успешна, но вход не выполнен: ' + signInError.message)
            return
        }

        router.push('/')
    }

    return (
        <div className="max-w-md mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                    className="w-full p-2 border rounded"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                <input
                    type="password"
                    placeholder="пароль"
                    {...register('password')}
                    className="w-full p-2 border rounded"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >Зарегистрироваться</button>

                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    )
}